import { Request, Response, NextFunction } from "express";
import db from "../lib/db";
import { kenoGameConstants, kenoPayouts } from "../utils/constants/kenoGameConstants";
import { TicketStatus } from "@prisma/client";

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const now = new Date();

  try {
    // Update KenoGame status and winning numbers
    await db.kenoGame.updateMany({
      where: {
        ticketWillBeDisabledAt: { lte: now },
        status: "NOT_STARTED",
      },
      data: {
        status: "ON_PLAY",
        winningNumbers: generateUniqueRandomNumbers(kenoGameConstants.numberOfWinningNumbersToGenerate, kenoGameConstants.startNumber, kenoGameConstants.endNumber), // Example: 20 unique numbers between 1 and 80
      },
    });
    console.log(
      "KenoGame status updated to ON_PLAY and winning numbers generated"
    );

    // Update KenoGame status to DONE
    await db.kenoGame.updateMany({
      where: {
        endAt: { lte: now },
        status: { not: "DONE" },
      },
      data: {
        status: "DONE",
      },
    });
    console.log("KenoGame status updated to DONE");

    // Update Ticket and TicketSelection statuses and winAmount
    const completedGames = await db.kenoGame.findMany({
      where: {
        endAt: { lte: now },
        status: "DONE",
      },
      include: {
        tickets: {
          where: {
            status: "ON_PLAY",
          },
          include: {
            selections: true,
          },
        },
      },
    });

    for (const game of completedGames) {
      // Added logic to run only ON_PLAY tickets
      for (const ticket of game.tickets) {
        let ticketWinAmount = 0;
        let ticketStatus = false;

        for (const selection of ticket.selections) {
          const hitCount = selection.selectedNumbers.filter((num) =>
            game.winningNumbers.includes(num)
          ).length;
          const selectionCount = selection.selectedNumbers.length;

          const oddAmount = getPayoutMultiplierForSelection(
            selectionCount,
            hitCount
          );
          const selectionWinAmount = oddAmount * selection.betAmount;

          console.log(
            `Selection: ${selection.id}, Selected Numbers: ${selection.selectedNumbers}, Hit Count: ${hitCount}, Odd Amount: ${oddAmount}, Selection Win Amount: ${selectionWinAmount}`
          );

          await db.ticketSelection.update({
            where: { id: selection.id },
            data: {
              winAmount: selectionWinAmount,
              status: selectionWinAmount > 0 ? "WIN" : "LOSE",
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
            status: ticketStatus ? "WIN" : "LOSE",
          },
        });
      }
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
