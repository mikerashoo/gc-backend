import { Request, Response } from "express"; 
import { registerProviderAdmin } from "../../../services/admin/provider-services";
import { UserRole } from "@prisma/client";
import db from "../../../lib/db";
import { IProviderUserRegistrationSchema } from "../../../utils/shared/schemas/provider/provider-users-schema";

export const getProviderAdmins = async (req: any, res: any) => {
  try {
    const users = await db.user.findMany({
      where: {
        role: UserRole.PROVIDER_ADMIN,
      },
      
    });

     // Map over the users array and omit the password field
     const usersWithoutPasswords = users.map((user) =>
      // @ts-ignore
      Object.fromEntries(Object.entries(user).filter(([key]) => key !== "password"))
    );

    return res.status(200).json(usersWithoutPasswords); 
  } catch (error) {
    console.error("Error logging", error);
    return res.status(500).json({ error });
  }
};

export const addProviderAdmin = async (req: any, res: any) => {
  try {

    
    const registerData = await registerProviderAdmin(req.body);
    if (registerData.error) {
      return res.status(403).json({ error: registerData.error });
    }
  
    

    return res.status(201).json(registerData.response);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(403).json({ error });
  }

};

export const updateProviderAdmin = async (req: any, res: any) => {
  try {

    
    const registerData = await registerProviderAdmin(req.body);
    if (registerData.error) {
      return res.status(403).json({ error: registerData.error });
    }
  
    

    return res.status(201).json(registerData.response);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(403).json({ error });
  }
};
