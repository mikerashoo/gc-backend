import bcrypt = require("bcrypt");
import { ProviderBranchCashierService } from "../../services/providers/provider-cashier-services";
import db from "../../lib/db";
import { ActiveStatus } from "@prisma/client";
import { IChangePasswordSchema } from "../../utils/shared/schemas/userSchemas";
import { date } from "zod";


export const getCashiersBranch = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;

    const cashiers = await ProviderBranchCashierService.list(
      branchId
    );
    if (cashiers.error) {
      return res.status(403).json({ error: cashiers.error });
    }

    return res.status(200).json(cashiers.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const addCashierToBranch = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;

    const addCashier = await ProviderBranchCashierService.add(
      branchId,
      req.body
    );
    if (addCashier.error) {
      return res.status(403).json({ error: addCashier.error });
    }

    return res.status(200).json(addCashier.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};



export const updateCashier = async (req: any, res: any) => {
  try {
    const cashierId = req.params.cashierId;

    const addCashier = await ProviderBranchCashierService.update(
      cashierId,
      req.body
    );
    if (addCashier.error) {
      return res.status(403).json({ error: addCashier.error });
    }

    return res.status(200).json(addCashier.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const changeStatusOfCashier = async (req: any, res: any) => {
  try { 
    const cashierId = req.params.cashierId;


    const cashierExists = await db.cashier.findUnique({
      where: {
        id: cashierId, 
      }
    })
    if (!cashierExists) {
      return res.status(403).json({ error: "Invalid Cashier Id" });
    }

    const status = cashierExists.status == ActiveStatus.ACTIVE ? ActiveStatus.IN_ACTIVE : ActiveStatus.ACTIVE;

    const cashierUpdated = await db.cashier.update({
      where: {
        id: cashierId, 
      },
      data: {
        status
      }
    })
    delete cashierUpdated.password
    return res.status(200).json(cashierUpdated);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const changeCashierPassword = async (req: any, res: any) => {
  try { 
    const cashierId = req.params.cashierId;

    const {
      password
    } = req.body as IChangePasswordSchema

    const hashedPassword = await bcrypt.hash(password, 10);

    const cashierExists = await db.cashier.update({
      where: {
        id: cashierId, 
      },
      data: {
        password: hashedPassword
      },
      select: {id: true}
    })
   


    if(cashierExists.id){
      return res.status(200).json(true);
    }
    else { 
    return res.status(500).json({ error: "Something went wrong" });
    }
 
 
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const deleteCashier = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;
    const cashierId = req.params.cashierId;

    const deleteCashier = await ProviderBranchCashierService.delete(
      cashierId,
      branchId
    );
    if (deleteCashier.error) {
      return res.status(403).json({ error: deleteCashier.error });
    }

    return res.status(200).json(deleteCashier.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
