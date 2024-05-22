import { Request, Response } from "express"; 
import db from "../lib/db";

export const getUsers = async (req: Request, res: Response) => {
  try {
     
    const users = await db.user.findMany({});

       
    return res.status(201).json(users);
  } catch (error) {
    console.error("Error logging", error);
    return res.status(500).json({ error });
  }
}; 