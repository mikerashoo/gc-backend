import { ActiveStatus } from "@prisma/client";
import db from "../../lib/db";
import { IUserType } from "../../lib/jwt";
const jwt = require('jsonwebtoken');

 async function isVerifiedProviderAdmin(req, res, next) {

  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401);
    throw new Error('🚫 Un-Authorized Missing Authorization Header 🚫');
  } 

  try {
    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("Payload", payload)
    req.payload = payload;
  } catch (err) { 
    if (err.name === 'TokenExpiredError') { 
    return res.status(401).json({ error: err.name});

    }
    return res.status(401).json({ error: "Un-Authorized" });
 
  }
 
  // Check if the user is authenticated first
  if (!req.payload) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  // Check if the user's role is PROVIDER_ADMIN
  if (req.payload.userType != IUserType.PROVIDER) {
    return res
      .status(403)
      .json({ error: "Forbidden", message: "User is not valid Provider" });
  }

  // Check if the user is an admin of the specified provider
  const providerId = req.payload.providerId; // Assuming the providerId is in the request params
  const id = req.payload.adminId;

  const providerAccount = await db.providerAdmin.findFirst({
    where: {
      id,
      providerId
    },
  });

  if (!providerAccount) {
    return res
      .status(403)
      .json({
        error: "Invalid provider id",
        message: "provider with id not found",
      });
  }

  if (providerAccount.status == ActiveStatus.IN_ACTIVE) {
    return res
      .status(401)
      .json({
        error: "Invalid status",
        message: "User Has Been Disabled",
      });
  }
 
 

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
 

module.exports = { 
  isVerifiedProviderAdmin
};
