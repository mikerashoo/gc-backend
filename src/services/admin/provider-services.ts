import bcrypt = require("bcrypt");
  
import { findUserByEmailPhoneOrUserName } from "../user-services";
import { Provider, UserRole } from "@prisma/client";
import db from "../../lib/db";
import { hashToken } from "../../lib/hashToken";
import { PrismaCallResponse } from "../../utils/types/prismaCallResponse";


export const findProviderWithNameOrIdentifier = async (identifier: string, name: string) : Promise<Provider> => {
  try {
    return await db.provider.findFirst({
      where: {
      OR: [
        { identifier: {
          equals: identifier,
          mode: "insensitive",
        } }, { name: {
          equals: name,
          mode: "insensitive",
        } } 
      ]
      },
    });
 
  } catch (err : any) {
    throw err;
  }
};




export const findProviderById = async (id: string) => {
  try {
    return await db.provider.findUnique({
      where: {
      id
      },
    });
  } catch (err : any) {
    throw err;
  }
};


export const findProviderWIthIdentifier = async (identifier: string) => {
  try {
    return await db.provider.findFirst({
      where: {
      identifier: {
        equals: identifier,
        mode: "insensitive",
      }
      },
    });
  } catch (err : any) {
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
  } catch (err : any) {
    throw err;
  }
};

export const findUserByPhoneNumber = async (phoneNumber: string) => {
  try {

    const lastDigits = phoneNumber.slice(-8)

    const zeroFormat = "09" + lastDigits;
    const plusFormat = "+251923213768" + lastDigits;
    return await db.user.findFirst({
      where: {
        phoneNumber: {
          in: [zeroFormat, plusFormat],
          mode: "insensitive",

        }
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
        userName : {
          equals: userName,
          mode: "insensitive",
        },

      },
    });
  } catch (err : any) {
    throw err;
  }
};



export const registerProviderAdmin = async (
  data: any, 
): Promise<PrismaCallResponse> => {
  try {
    const { fullName, email, userName, phoneNumber, password, providerId } = data;
    let error = null;
 
    
    const isProviderExist =await findProviderById(providerId);
    if(!isProviderExist){
      error = "Invalid providerId. Provider doesn't exist";
      return {
        status: false,
        error,
      };
     
    }
 
    const userExists = await findUserByEmailPhoneOrUserName(userName, phoneNumber, email);
    if(userExists && userExists.email == email){
      error = "Email already taken";
      return {
        status: false,
        error,
      };
    }

    if(userExists && userExists.phoneNumber == phoneNumber){
      error = "Phone Number already taken";
      return {
        status: false,
        error,
      };
    }

    if(userExists && userExists.userName == userName){
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
        role: UserRole.PROVIDER_ADMIN,
        password: hashedPassword,
        providers: {
          connect: {
            id: providerId
          }
        }
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



export const addRefreshTokenToWhitelist = async ({ jti, refreshToken, userId }) => {
  return await db.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId
    },
  });
}

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
      revoked: true
    }
  });
}

export function revokeTokens(userId) {
  return db.refreshToken.updateMany({
    where: {
      userId
    },
    data: {
      revoked: true
    }
  });
}