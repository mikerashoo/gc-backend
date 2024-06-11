import { UserRole } from "@prisma/client";
import db from "../lib/db";

export async function isValidCashierAndBranch(req, res, next) {
  // Check if the user is authenticated first
  if (!req.payload) {
    return res.status(401).json({ error: "Un-Authorized" });
  }
 

  // Check if the user's role is PROVIDER_ADMIN
  if (req.payload.role !== UserRole.CASHIER || req.payload.accountId == null) {
    return res.status(403).json({
      error: "Forbidden",
      message: "User is not valid cashier",
    });
  }

  const cashierId = req.payload.accountId;
  const branchId = req.params.branchId; // Assuming the providerId is in the request params

  const validBranchAndCashier = await db.cashierAccount.findUnique({
    where: {
      id: cashierId,
      branchId,
    },
  });

  if (!validBranchAndCashier) {
    return res.status(403).json({
      error: "Invalid Credentials",
      message: "Branch Id or Cashier ID is wrong",
    });
  }

  //// validate keno game requests
  const kenoGameId = req.params.kenoGameId;
  if (kenoGameId) {
    const validKenoGameForBranch = await db.kenoGame.findUnique({
      where: {
        id: kenoGameId,
        branchId,
      },
    });

    if (!validKenoGameForBranch) {
      return res.status(403).json({
        error: "Invalid keno game id",
        message: "Keno Game with the given id doesn't exist under the Branch",
      });
    }
  }


  //// validate keno ticket requests
  const ticketId = req.params.ticketId;
  if (ticketId) {
    const validateTicketForBranch = await db.ticket.findUnique({
      where: {
        id: ticketId,
        game: {
         branchId
        }
      },
    });

    if (!validateTicketForBranch) {
      return res.status(403).json({
        error: "Invalid keno game id",
        message: "Keno Game with the given id doesn't exist under the Branch",
      });
    }
  }

  // User is authenticated, has the role of PROVIDER_ADMIN, and is an admin of the specified provider
  return next();
}
