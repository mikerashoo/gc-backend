import bcrypt = require("bcrypt");
import { ActiveStatus, Prisma, User, UserRole } from "@prisma/client";
import db from "../lib/db"; 
import { hashToken } from "../lib/hashToken";
import { PrismaCallResponse } from "../utils/types/prismaCallResponse"; 
import { IDBUser, IDBUserWithRelations } from "../utils/shared/shared-types/prisma-models";
import { IUser } from "../utils/shared/shared-types/userModels";
import { IServiceResponse } from "../utils/api-helpers/serviceResponse";
import { IChangePasswordSchema, IUserUpdateSchema } from "../utils/shared/schemas/userSchemas";
import { checkDBColumnDuplicate } from "../utils/api-helpers/unique-identifier-generator";

export const findUserById = async (id: string) => {
  try {
     
    return await db.user.findFirst({
      where: {
        id,
      },
      include: {
        provider: true,
        cashierBranch: true,
        agentProvider: true,
      }
    });
  } catch (err: any) {
    throw err;
  }
};

export const findUserByEmailPhoneOrUserName = async (
  userName: string,
  phoneNumber: string,
  email: string
): Promise<User | null> => {
  try {
    return await db.user.findFirst({
      where: {
        OR: [{ phoneNumber }, { email }, { userName }],
      },
    });
  } catch (err: any) {
    throw err;
  }
};

export const findLoginUser = async (userNameInfo: string)=> {
  try {
    const user = await db.user.findFirst({
      where: {
        userName: {
          equals: userNameInfo,
          mode: "insensitive",
        },
      },

      include: {
        provider: true,
        agentProvider: true,
        cashierBranch: true,
      }
      
    });

    return user;
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      throw new Error(err.message);
    }
    throw err;
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });
  } catch (err: any) {
    throw err;
  }
};

export const findUserByPhoneNumber = async (phoneNumber: string) => {
  try {
    const lastDigits = phoneNumber.slice(-8);

    const zeroFormat = "09" + lastDigits;
    const plusFormat = "+251923213768" + lastDigits;
    return await db.user.findFirst({
      where: {
        phoneNumber: {
          in: [zeroFormat, plusFormat],
          mode: "insensitive",
        },
      },
    });
  } catch (err: any) {
    throw err;
  }
};

export const findUserByUserName = async (userName: string) => {
  try {
    return await db.user.findFirst({
      where: {
        userName: {
          equals: userName,
          mode: "insensitive",
        },
      },
    });
  } catch (err: any) {
    throw err;
  }
};

export const registerUser = async (
  data: any,
  role: UserRole
): Promise<PrismaCallResponse> => {
  try {
    const { firstName, lastName, email, userName, phoneNumber, password } = data;
    let error = null;

    const userExists = await findUserByEmailPhoneOrUserName(
      userName,
      phoneNumber,
      email
    );
    if (userExists && userExists.email == email) {
      error = "Email already taken";
      return {
        status: false,
        error,
      };
    }

    if (userExists && userExists.phoneNumber == phoneNumber) {
      error = "Phone Number already taken";
      return {
        status: false,
        error,
      };
    }

    if (userExists && userExists.userName == userName) {
      error = "Username already taken";
      return {
        status: false,
        error,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        userName,
        phoneNumber,
        role,
        password: hashedPassword,
      },
    });

    return {
      status: true,
      response: user,
    };
  } catch (err: any) {
    throw err;
  }
};

export const addRefreshTokenToWhitelist = async ({
  jti,
  refreshToken,
  userId,  
}) => { 
  let userIdField = 'userId';
  return await db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId
    },
  });
};



export function findRefreshTokenById(id) {
  return db.refreshToken.findUnique({
    where: {
      id,
    },
  });
}

export function deleteRefreshToken(id) {
  return db.refreshToken.update({
    where: {
      id,
    },
    data: {
      revoked: true,
    },
  });
} 

export function revokeTokens(userId) {
  return db.refreshToken.updateMany({
    where: {
      userId,
    },
    data: {
      revoked: true,
    },
  });
}


export async function validatePassword(dbPassword: string, newPassword): Promise<boolean> {
  return  await bcrypt.compare(newPassword, dbPassword);
   
}



const updateUser = async (
  userId: string,
  userUpdateData: IUserUpdateSchema, 

): Promise<IServiceResponse<IUser>> => {
  const {firstName, lastName, phoneNumber, userName } = userUpdateData;
  
 
  const userNameTaken = await checkDBColumnDuplicate("user", {
    
    id: { not: userId },

    userName: {
      equals: userName.trim(),
      mode: "insensitive",
    },
    
  });
  if (userNameTaken) {
    return {
      error: "User Name is already Taken Please Use another and try again",
    };
  }
  const updatedUser = await db.user.update({
    where: { 
      
      id: userId
     },
    data: {
       firstName,
       lastName,
       phoneNumber,
       userName
    },
  });
  delete updatedUser.password;
  return {
    data: updatedUser,
  };
};


 const changeStatus = async (
  id: string, 
) : Promise<IServiceResponse<IUser>> => {
  try {  

    const user = await db.user.findUnique({
      where: {
        id
      }
    })
    if (!user) {
      return {
        error: "Invalid User Id",
      };
    }

    const status = user.status == ActiveStatus.ACTIVE ? ActiveStatus.IN_ACTIVE : ActiveStatus.ACTIVE;

    const userUpdated = await db.user.update({
      where: {
        id
      },
      
      data: {
        status
      }
    })
    await revokeTokens(id)

    delete userUpdated.password
   
    return {
      data: userUpdated,
    };
  } catch (error) {
    return {
      error: "Something went wrong.",
    };
  }
};


 const changePassword = async ({id, passwordData} : {
  id: string;
  passwordData: IChangePasswordSchema
 }): Promise<IServiceResponse<boolean>> => {
  try { 
    const user = await db.user.findUnique({
      where: {
        id
      }
    })
    if (!user) {
      return {
        error: "Invalid User Id",
      };
    }

    const {
      password
    } = passwordData

    const hashedPassword = await bcrypt.hash(password, 10);

    const cashierExists = await db.user.update({
      where: {
        id
      },
      data: {
        password: hashedPassword
      },
      select: {id: true}
    })


    
    await revokeTokens(cashierExists.id)
   

    return {
      data: true
    }
 
 
 
  } catch (error) {
    return {
      error: "Something went wrong.",
    };
  }
};


const deleteUser = async (
  id: string, 
): Promise<IServiceResponse<boolean>> => {
  const deleted = await db.user.delete({
    where: {
      id, 
    },
  });
  return {
    data: deleted ? true : false,
  };
};


export const CommonUserManagementService = { 
  update: updateUser,
  changePassword,
  changeStatus,
  delete: deleteUser,
};
