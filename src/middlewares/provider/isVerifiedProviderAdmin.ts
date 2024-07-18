import { ActiveStatus, UserRole } from "@prisma/client";
import db from "../../lib/db";
import { isProvider } from "../../lib/helper/userRoleHelpers";
const jwt = require("jsonwebtoken");

async function isVerifiedProviderAdmin(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error("🚫 Un-Authorized Missing Authorization Header 🚫");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("Payload", payload);
    req.payload = payload;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: err.name });
    }
    return res.status(401).json({ error: "Un-Authorized" });
  }

  if (!req.payload || !req.payload.role || !req.payload.providerId) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  console.log("Req payload", req.payload);

  if (!isProvider(req.payload.role)) {
    return res
      .status(403)
      .json({ error: "Forbidden", message: "User is not valid Provider" });
  }

  // Check if the user is an admin of the specified provider
  const providerId = req.payload.providerId; // Assuming the providerId is in the request params
  const id = req.payload.accountId;

  const providerAccount = await db.user.findFirst({
    where: {
      id,
      providerId,
    },
  });

  if (!providerAccount) {
    return res.status(403).json({
      error: "Invalid provider id",
      message: "provider with id not found",
    });
  }

  if (providerAccount.status == ActiveStatus.IN_ACTIVE) {
    return res.status(401).json({
      error: "Invalid status",
      message: "User Has Been Disabled",
    });
  }

  // validate agentId
  const agentId =
    req.params.agentId ??
    req.query.agentId ??
    req.params.superAgentId ??
    req.query.superAgentId;
  if (agentId) {
    const validSuperAgent = await db.user.findFirst({
      where: {
        OR: [
          {
            id: agentId,
          },
          {
            userName: agentId,
          },
        ],
        agentProviderId: providerId,
        role: {in: [UserRole.SUPER_AGENT, UserRole.AGENT]}
      },
    });

    if (!validSuperAgent) {
      return res.status(403).json({
        error: "Invalid Agent id",
        message: "Agent doesn't exist under given provider",
      });
    }
    req.payload = {
      ...req.payload,
      queryAgentId: agentId
    };

  }

  // validating shop Id
  const shopId = req.query.shopId ?? req.params.shopId;

  if (shopId) {
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
  }

  const cashierId = req.query.cashierId ?? req.params.cashierId;

  if (cashierId) {
    const validCashier = await db.user.findFirst({
      where: {
        OR: [{ id: cashierId }, { userName: cashierId }],
        providerId, 
        role: UserRole.CASHIER
      },
    });

    if (!validCashier) {
      return res.status(403).json({
        error: "Invalid shop id",
        message: "Shop doesn't exist under given provider",
      });
    } 
  } 

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}

module.exports = {
  isVerifiedProviderAdmin,
};
