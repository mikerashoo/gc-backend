import { Request, Response, NextFunction } from "express";
import db from "../lib/db";
import { kenoGameConstants, kenoPayouts } from "../utils/constants/kenoGameConstants";
import { GameStatus, GameType, TicketStatus } from "@prisma/client";

// Helper function to generate unique random numbers and sort them
function generateUniqueRandomNumbers(
  count: number,
  min: number,
  max: number
): number[] {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers); // Sort the numbers before returning
}

const getPayoutMultiplierForSelection = (
  selectionCount: number,
  hitCount: number
) => {
  const payout = kenoPayouts[selectionCount - 1];
  if (!payout) return 0;
  const index = payout.hits.indexOf(hitCount);
  return index !== -1 ? payout.pays[index] : 0;
};

// Middleware to check and update game and ticket statuses
const checkGameStatusMiddleware = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  const now = new Date();

  try {
    // Update KenoGame with status NOT_STARTED and ticketWillBeDisabledAt has passed
    const kenoToPlayGames = await db.game.findMany({
      where: {
        gameType: GameType.KENO,
        keno: {
          ticketWillBeDisabledAt: { lte: now },
        },
        status: GameStatus.NOT_STARTED,
      },
      include: {
        keno: true,
      },
    });

    for (const kenoGame of kenoToPlayGames) {
      const winningNumbers = generateUniqueRandomNumbers(
        kenoGameConstants.numberOfWinningNumbersPerGame,
        kenoGameConstants.startNumber,
        kenoGameConstants.endNumber
      );
      await db.kenoGame.update({
        where: {
          id: kenoGame.keno.id,
        },
        data: {
          winningNumbers,
        },
      });

      await db.game.update({
        where: {
          id: kenoGame.id,
        },
        data: {
          status: GameStatus.ON_PLAY,
        },
      });
    }

    console.log(
      "KenoGame status updated to ON_PLAY and winning numbers generated"
    );

    // Update KenoGame with status not DONE and endAt has passed
    const kenoToEndGames = await db.game.findMany({
      where: {
        gameType: GameType.KENO,
        endAt: { lt: now },
        status: { not: GameStatus.DONE },
      },
      include: {
        keno: true,
        tickets: {
          where: {
            status: TicketStatus.ON_PLAY,
          },
          include: {
            kenoTicket: {
              include: {
                selections: true,
              },
            },
          },
        },
      },
    });

    for (const game of kenoToEndGames) {
      const winningNumbers = game.keno.winningNumbers;
      for (const ticket of game.tickets) {
        let ticketWinAmount = 0;
        let ticketStatus = false;

        for (const selection of ticket.kenoTicket.selections) {
          const hitCount = selection.selectedNumbers.filter((num) =>
            winningNumbers.includes(num)
          ).length;
          const selectionCount = selection.selectedNumbers.length;

          const oddAmount = getPayoutMultiplierForSelection(
            selectionCount,
            hitCount
          );
          const selectionWinAmount = oddAmount * selection.betAmount;

          await db.ticketSelection.update({
            where: { id: selection.id },
            data: {
              winAmount: selectionWinAmount,
              status: selectionWinAmount > 0 ? TicketStatus.WIN : TicketStatus.LOSE,
            },
          });

          if (selectionWinAmount > 0) {
            ticketStatus = true;
          }
          ticketWinAmount += selectionWinAmount;
        }

        await db.ticket.update({
          where: { id: ticket.id },
          data: {
            winAmount: ticketWinAmount,
            status: ticketStatus ? TicketStatus.WIN : TicketStatus.LOSE,
          },
        });
      }

      await db.game.update({
        where: {
          id: game.id,
        },
        data: {
          status: GameStatus.DONE,
        },
      });
    }

    console.log("Ticket and TicketSelection statuses and winAmount updated");
  } catch (error) {
    console.error("Error updating game or ticket statuses:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }

  next();
};

export default checkGameStatusMiddleware;
