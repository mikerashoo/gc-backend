import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import bcrypt = require("bcrypt");
import {
  addRefreshTokenToWhitelist,
  deleteRefreshToken,
  findLoginUser,
  findRefreshTokenById,
} from "../../services/user-services";
import { findUserById } from "../../services/user-services"; 
import { hashToken } from "../../lib/hashToken";
import { generateTokens, verifyJwt } from "../../lib/jwt";

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
      jti
    );

    await addRefreshTokenToWhitelist({
      jti,
      refreshToken,
      userId: existingUser.id,
      cashierId: null
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

    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await deleteRefreshToken(savedRefreshToken.id);
    const jti = uuidv4();
    const {
      accessToken,
      refreshToken: newRefreshToken,
      accessTokenExpires,
    } = generateTokens(user, jti);
    await addRefreshTokenToWhitelist({
      jti,
      refreshToken: newRefreshToken,
      userId: user.id,
      cashierId: null
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

// This endpoint is only for demo purpose.
// Move this logic where you need to revoke the tokens( for ex, on password reset)
// router.post('/revokeRefreshTokens', async (req, res, next) => {
//   try {
//     const { userId } = req.body;
//     await revokeTokens(userId);
//     res.json({ message: `Tokens revoked for user with id #${userId}` });
//   } catch (err : any) {
//     next(err);
//   }
// });
