import db from "../../lib/db";
import { isProvider } from "../../lib/helper/userRoleHelpers";

export async function isValidBranchForProvider(req, res, next) {
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
  const branchId = req.params.branchId; // Assuming the providerId is in the request params

  console.log("Branch Id on isvalidBranchForProvider", branchId);

  if (!branchId) {
    return res
      .status(403)
      .json({ error: "Branch Id Not Found", message: "Branch Id is required" });
  }
  const validBranch = await db.branch.findFirst({
    where: {
      OR: [{ id: branchId }, { identifier: branchId }],
      providerId,
    },
  });

  if (!validBranch) {
    return res.status(403).json({
      error: "Invalid branch id",
      message: "Branch doesn't exist under given provider",
    });
  }

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
