import bcrypt = require("bcrypt");
  
import { findUserByEmailPhoneOrUserName } from "../user-services";
import { Provider, UserRole } from "@prisma/client";
import db from "../../lib/db";
import { hashToken } from "../../lib/hashToken"; 
import { PrismaCallResponse } from "../../utils/types/prismaCallResponse";
import { IProviderUserRegistrationSchema } from "../../utils/shared/schemas/provider/provider-users-schema";


export const findProviderWithIdentifier = async (identifier: string) : Promise<Provider> => {
  try {
    return await db.provider.findFirst({
      where: { identifier: {
          equals: identifier,
          mode: "insensitive",
      }
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
    const { firstName, lastName, email, userName, phoneNumber, password, providerId, role } = data as IProviderUserRegistrationSchema;
    let error = null;
 
    
    const isProviderExist =await findProviderById(providerId);
    if(!isProviderExist){
      error = "Invalid providerId. Provider doesn't exist";
      return {
        status: false,
        error,
      };
     
    }
 
    const userExists = await db.user.findFirst({
      where: {
       userName 
      },
    });
    

    if(userExists){
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
        providerId: providerId
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