
import { Request, Response } from "express";
import db from "../../lib/db";
import { addRefreshTokenToWhitelist, validatePassword } from "../../services/user-services";
import { generateCashierTokens } from "../../lib/cashierJwt";
import { v4 as uuidv4 } from "uuid";
import { ICashierLoginData } from "../../utils/shared/shared-types/userModels";


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
      // const user = {
      //   ...userExists,
      //   account: cashier,
      // };
  
      const jti = uuidv4();
      const { accessToken, refreshToken, accessTokenExpires } = generateCashierTokens(
        cashier,
        jti
      );
  
      await addRefreshTokenToWhitelist({
        jti,
        refreshToken,
        cashierId: cashier.id,
        userId: null
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
  