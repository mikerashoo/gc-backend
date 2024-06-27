import { Request, Response } from "express";  
import { findUserByEmailPhoneOrUserName } from "../../services/user-services";
import bcrypt = require("bcrypt"); 
import { UserRole } from "@prisma/client";
import db from "../../lib/db";


 

export const registerCashierToBranch = async (req: any, res: any) => {
  try {
    const branchId = req.payload.branchId;

    const { fullName, email, userName, phoneNumber, password } = req.body;

 

    const userExists = await findUserByEmailPhoneOrUserName(userName, phoneNumber, email);
    if(userExists && userExists.email == email){
      return res.status(403).json({ error: "email is already taken" });
    }

    if(userExists && userExists.userName == userName){
      return res.status(403).json({ error: "userName is already taken" });
    }


    if(userExists && userExists.phoneNumber == phoneNumber){
      return res.status(403).json({ error: "phoneNumber is already taken" });
    }
  
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const cashier = await db.cashier.create({
      data: {
        fullName, 
        phoneNumber, 
        password: hashedPassword,
        branchId, 
        userName,
      },
    });

    delete cashier.password;
 

    return res.status(200).json({cashier});
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};
