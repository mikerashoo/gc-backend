import bcrypt = require("bcrypt"); 
import db from "../../lib/db";
import { ICashierRegisterSchema } from "../../utils/shared/schemas/userSchemas";


 

export const registerCashierToBranch = async (req: any, res: any) => {
  try { 

    const {  firstName,
      lastName, branchId, userName, phoneNumber, password } = req.body as ICashierRegisterSchema;

      const cashierExists =  await db.cashier.findFirst({
        where: {
          userName
        },
      });
 
  

    if(cashierExists){
      return res.status(403).json({ error: "userName is already taken" });
    }

 
  
  
    const hashedPassword = await bcrypt.hash(password, 10);

    const cashier = await db.cashier.create({
      data: {
        firstName,
        lastName, 
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
