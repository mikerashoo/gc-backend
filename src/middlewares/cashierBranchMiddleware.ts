 
import { UserRole } from "@prisma/client"; 
import db from "../lib/db";

export async function isValidCashierAndBranch(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload) {
    return res.status(401).json({ error: "Un-Authorized" });
  }

  // Check if the user's role is PROVIDER_ADMIN
  if (req.payload.role !== UserRole.CASHIER) {
    return res
      .status(403)
      .json({
        error: "Forbidden",
        message: "User is not valid provider admin",
      });
  }

  const cashierId = req.payload.userId;
  const branchId = req.params.branchId; // Assuming the providerId is in the request params

  const validBranch = await db.branch.findUnique({
    where: {
      id: branchId,
    },
    include: {
      cashiers: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!validBranch) {
    return res
      .status(403)
      .json({
        error: "Invalid branch id",
        message: "Branch doesn't exist under given provider",
      });
  }
  const cashierIdExists =
    validBranch &&
    validBranch.cashiers.some((cashier) => cashier.id === cashierId);

  if (!cashierIdExists) {
    return res
      .status(403)
      .json({
        error: "Invalid cashier id",
        message: "Cashier doesn't exist under the Branch",
      }); 
  }

  const kenoGameId = req.params.kenoGameId;
  if(kenoGameId){

  const validKenoGameForBranch = await db.kenoGame.findUnique({
    where: {
      id: kenoGameId,
      branchId
    },
   
  });

  if (!validKenoGameForBranch) {
    return res
      .status(403)
      .json({
        error: "Invalid keno game id",
        message: "Keno Game with the given id doesn't exist under the Branch",
      });
  }

  }


  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
