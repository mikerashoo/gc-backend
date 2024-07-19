import db from "../../lib/db";
import { isProvider } from "../../lib/helper/userRoleHelpers";

export async function isValidShopForProvider(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload || !req.payload.role || !req.payload.providerId) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  if (!isProvider(req.payload.role)) {
    return res
      .status(403)
      .json({ error: "Forbidden", message: "User is not valid Provider" });
  }

  const providerId = req.payload.providerId; // Assuming the providerId is in the request params
  const shopId = req.params.shopId; // Assuming the providerId is in the request params
 

  if (!shopId) {
    return res
      .status(403)
      .json({ error: "Shop Id Not Found", message: "Shop Id is required" });
  }
  const validShop = await db.shop.findFirst({
    where: {
      OR: [{ id: shopId }, { identifier: shopId }],
      providerId,
    },
  });

  if (!validShop) {
    return res.status(403).json({
      error: "Invalid shop id",
      message: "Shop doesn't exist under given provider",
    });
  }

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
