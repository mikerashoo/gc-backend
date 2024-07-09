import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import bcrypt = require("bcrypt");
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findLoginUser,
  findRefreshTokenById,
  validatePassword,
} from "../../services/user-services";
import { findUserById } from "../../services/user-services"; 
import { hashToken } from "../../lib/hashToken";
import { IUserType, generateTokens, verifyJwt } from "../../lib/jwt"; 
import { ICashierLoginData, IProviderAdminLoginData } from "../../utils/shared/shared-types/userModels";
import db from "../../lib/db";

export const login = async (req: any, res: any) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ error: "You must provide an userName and a password." });
    }

    const existingUser = await findLoginUser(userName);

    if (!existingUser) {
      return res.status(403).json({ error: "Invalid login credentials. User Not Found" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(403).json({ error: "Invalid login credentials. Incorrect credientials" });
    }

    const jti = uuidv4();
    const { accessToken, refreshToken, accessTokenExpires } = generateTokens(
      existingUser,
      IUserType.USER,
      jti
    );

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id, 
      type: IUserType.USER
    });

    delete existingUser.password;
    const userROle = existingUser.role; 
    return res.status(201).json({
      ...existingUser,
      accessToken,
      refreshToken,
      accessTokenExpires,
    });
  } catch (error) {
    console.error("Error logging", error);
    return res.status(500).json({ error });
  }
}; 

export const getRefreshToken = async (req: any, res: any) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token." });
    }
    const payload = verifyJwt(refreshToken);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await findUserById(payload.userId, payload.userType);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
    } = generateTokens(user, IUserType.USER, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
      type:  payload.userType
      
    });

    res.json({
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
    });
  } catch (error) {
    console.error("Error getting refresh token", error);
    return res.status(500).json({ error });
  }
};


export const validateRefreshToken = async (req: any, res: any) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: "Missing refresh token." });
    }
    const payload = verifyJwt(refreshToken);
    const savedRefreshToken = await findRefreshTokenById(payload.jti);

    if (!savedRefreshToken || savedRefreshToken.revoked === true) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const hashedToken = hashToken(refreshToken);
    if (hashedToken !== savedRefreshToken.hashedToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await findUserById(payload.userId, payload.userType);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    return res.status(200).json({ message: "Valid" });
 
  } catch (error) {
    console.error("Error getting refresh token", error);
    return res.status(500).json({ error });
  }
};


export const cashierLogin = async (req: any, res: any) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ error: "You must provide an userName and a password." });
    }

    const cashier = await db.cashier.findFirst({
      where: {
        userName: {
          equals: userName,
          mode: "insensitive",
        },
      },
      include: {
        branch: true, 
      },
    });  
    if (!cashier) {
      return res.status(403).json({ error: "Invalid login credentials. Cashier Not Found" });
 
    }

    const validPassword = await validatePassword(cashier.password, password);
    if (!validPassword) {
      return res.status(403).json({ error: "Invalid login credentials. Incorrect Credential"});
      
    } 
    delete cashier.password;
   

    const jti = uuidv4();
    const { accessToken, refreshToken, accessTokenExpires } = generateTokens(
      cashier,
      IUserType.CASHIER,
      jti
    );

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: cashier.id,
      type: IUserType.CASHIER
       
    });

    delete cashier.password;

    const loginData: ICashierLoginData = {
      ...cashier,
      accessToken,
      refreshToken,
      accessTokenExpires,
    };
    return res.status(201).json(loginData);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(500).json({ error });
  }
};


export const providerAdminLogin = async (req: any, res: any) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res
        .status(400)
        .json({ error: "You must provide an userName and a password." });
    }

    const providerAdmin = await db.providerAdmin.findFirst({
      where: {
        userName: {
          equals: userName,
          mode: "insensitive",
        },
      },
      include: {
        provider: true, 
      },
    });  
    if (!providerAdmin) {
      return res.status(403).json({ error: "Invalid login credentials. Provider With UserName Not Found" });
 
    }

    const validPassword = await validatePassword(providerAdmin.password, password);
    if (!validPassword) {
      return res.status(403).json({ error: "Invalid login credentials. Incorrect Credential"});
      
    } 
    delete providerAdmin.password;
    

    const jti = uuidv4();
    const { accessToken, refreshToken, accessTokenExpires } = generateTokens(
      providerAdmin,
      IUserType.PROVIDER,
      jti
    );

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: providerAdmin.id,
      type: IUserType.PROVIDER
       
    });
 

    const loginData: IProviderAdminLoginData = {
      ...providerAdmin,
      accessToken,
      refreshToken,
      accessTokenExpires,
    };
    return res.status(201).json(loginData);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(500).json({ error });
  }
};