import { GameType } from "@prisma/client";
import db from "../../lib/db";
import { kenoPayouts } from "../../utils/constants/kenoGameConstants"; 
import { IKenoTicket } from "../../utils/shared/shared-types/keno";

export const ticketDetailInclude = {
  game: {
    include: {
      branch: true,
      keno: true,
      dogRacing: true,
    },
  },
  kenoTicket: {
    include: {
      selections: true,
    },
  },
  dogRacingTicket: true,
  payment: {
    include: {
      cashier: true
    },
  },
  cashier: true,
};

export const getKenoTicket = async (where: any): Promise<IKenoTicket> => {
  try {
    return await db.ticket.findUnique({
      where: where,
      include: {
        game: true,
        kenoTicket: {
          include: {
            selections: true
          }
        }
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getPayoutMultiplier = (
  selectionCount: number,
  hitCount: number
) => {
  const payout = kenoPayouts[selectionCount - 1];
  const index = payout.hits.indexOf(hitCount);
  return index !== -1 ? payout.pays[index] : 0;
};

export const getBetSlipStatusAndWin = (
  betSlip: any,
  winningNumbers: number[]
) => {
  const { selectedNumbers, betAmount } = betSlip;
  const hitCount = selectedNumbers.filter((num) =>
    winningNumbers.includes(num)
  ).length;
  const payoutMultiplier = getPayoutMultiplier(
    selectedNumbers.length,
    hitCount
  );
  const winAmount = payoutMultiplier * betAmount;
  return {
    status: winAmount > 0 ? "WIN" : "LOSE",
    winAmount,
  };
};
