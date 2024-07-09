import db from "../../lib/db";
import { IUserType } from "../../lib/jwt";

export async function isValidCashierForProvider(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  if (req.payload.userType != IUserType.PROVIDER) {
    return res
      .status(403)
      .json({ error: "Forbidden", message: "User is not valid Provider" });
  }

  const providerId = req.payload.providerId; // Assuming the providerId is in the request params
  const cashierId = req.params.cashierId; // Assuming the providerId is in the request params
  console.log("Cashier id on isValidCashierForProvider", cashierId)

  if (!cashierId) {
    return res
      .status(403)
      .json({ error: "Cashier Id Not Found", message: "Cashier Id is required" });
  }
  const valid = await db.cashier.findFirst({
    where: {
      id: cashierId, 
      branch: {
        providerId,

      }
    },
  });

  if (!valid) {
    return res
      .status(403)
      .json({
        error: "Invalid Cashier id",
        message: "Cashier doesn't exist under given provider",
      });
  }
 
  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
