import bcrypt = require("bcrypt");
import { ProviderShopCashierService } from "../../services/providers/provider-cashier-services";
import db from "../../lib/db";
import { ActiveStatus } from "@prisma/client";
import { IChangePasswordSchema } from "../../utils/shared/schemas/userSchemas";
import { date } from "zod";
import { CommonUserManagementService } from "../../services/user-services";

export const getCashiersShop = async (req: any, res: any) => {
  try {
    const shopId = req.params.shopId;

    const cashiers = await ProviderShopCashierService.list(shopId);
    if (cashiers.error) {
      return res.status(403).json({ error: cashiers.error });
    }

    return res.status(200).json(cashiers.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const addCashierToShop = async (req: any, res: any) => {
  try {
    const shopId = req.params.shopId;

    const addCashier = await ProviderShopCashierService.add(
      shopId,
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

    const addCashier = await ProviderShopCashierService.update(
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

    const changeStatusData = await CommonUserManagementService.changeStatus(
      cashierId
    );

    if (changeStatusData.error) {
      return res.status(403).json({ error: changeStatusData.error });
    }

    return res.status(200).json(changeStatusData.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const changeCashierPassword = async (req: any, res: any) => {
  try {
    const cashierId = req.params.cashierId;

    const changePasswordData = await CommonUserManagementService.changePassword(
      { id: cashierId, passwordData: req.body }
    );

    if (changePasswordData.error) {
      return res.status(403).json({ error: changePasswordData.error });
    }
    return res.status(200).json(changePasswordData.data);
  } catch (error) {
    console.error("Adding cashier error", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const deleteCashier = async (req: any, res: any) => {
  try {
    const shopId = req.params.shopId;
    const cashierId = req.params.cashierId;

    const deleteCashier = await ProviderShopCashierService.delete(
      cashierId,
      shopId
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
