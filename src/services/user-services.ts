import bcrypt = require("bcrypt"); 
import { Prisma, User, UserRole } from "@prisma/client";
import db from "../lib/db";
import { PrismaCallResponse } from "../utils/types/prismaCallResponse";
import { hashToken } from "../lib/hashToken";

export const findUserById = async (id: string) => {
  try {
    return await db.user.findFirst({
      where: {
        id,
      },
    });
  } catch (err : any) {
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
  } catch (err : any) {
    throw err;
  }
}; 

export const findLoginUser = async (userNameInfo: string) => {
  try {
    return await db.user.findFirst({
      where: {
        OR: [
          {
            phoneNumber: {
              equals: userNameInfo,
              mode: "insensitive",
            },
          },
          { email: {
            equals: userNameInfo,
            mode: "insensitive",
          } },
          { userName: {
            equals: userNameInfo,
            mode: "insensitive",
          } },
        ],
      },
    });
  } catch (err : any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
     throw new Error(err.message)
    
    }
    throw err 
  }
};

export const findUserByEmail = async (email: string) => {
  try {
    return await db.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        }
      },
    });
  } catch (err : any) {
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
  } catch (err : any) {
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
        }
      },
    });
  } catch (err : any) {
    throw err;
  }
};

export const registerUser = async (
  data: any,
  role: UserRole
): Promise<PrismaCallResponse> => {
  try {
    const { fullName, email, userName, phoneNumber, password } = data;
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
        fullName,
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
  } catch (err : any) {
    throw err;
  }
};

export const addRefreshTokenToWhitelist = async ({
  jti,
  refreshToken,
  userId,
}) => {
  return await db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
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
