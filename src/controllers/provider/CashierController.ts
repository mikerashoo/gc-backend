import { Request, Response } from "express";  
import { findUserByEmailPhoneOrUserName } from "../../services/user-services";
import bcrypt = require("bcrypt"); 
import { UserRole } from "@prisma/client";
import db from "../../lib/db";


 

export const registerCashierToBranch = async (req: Request, res: Response) => {
  try {
    const branchId = req.params.branchId;

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

    const cashier = await db.user.create({
      data: {
        fullName,
        email,
        userName,
        phoneNumber,
        role: UserRole.CASHIER,
        password: hashedPassword,
        cashierBranches: {
          connect: {
            id: branchId
          }
        }
      },
    });

    return res.status(200).json(cashier);
  } catch (error) {
    console.error("Error fetching branches", error);
    return res.status(500).json({ error: "Failed to fetch branches" });
  }
};
