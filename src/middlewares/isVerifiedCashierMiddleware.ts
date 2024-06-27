import { ActiveStatus } from "@prisma/client";
import db from "../lib/db";

async function isVerifiedCashier(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  // Check if the user's role is PROVIDER_ADMIN
  if (!req.payload.cashierId) {
    return res
      .status(403)
      .json({ error: "Forbidden", message: "User is not valid cashier" });
  }

  // Check if the user is an admin of the specified provider
  const branchId = req.payload.branchId; // Assuming the providerId is in the request params
  const id = req.payload.cashierId;

  const cashierExists = await db.cashier.findFirst({
    where: {
      id,
      branchId 
    },
  });

  if (!cashierExists) {
    return res
      .status(403)
      .json({
        error: "Invalid cashier id",
        message: "cashier with id not found",
      });
  }

  if (cashierExists.status == ActiveStatus.IN_ACTIVE) {
    return res
      .status(401)
      .json({
        error: "Invalid cashier",
        message: "Cashier Has Been Disabled",
      });
  }

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}

module.exports = {
  isVerifiedCashier,
};
