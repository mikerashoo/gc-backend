import { generateKenoGameId, generateGameLogicTimes } from ".";
import db from "../../lib/db";
import { IKenoGameWithTickets } from "../../utils/models/KenoModels";  
  // Get or create the current game based on existing criteria
  export async function getOrCreateCurrentKenoGame(
    branchId: string
  ): Promise<IKenoGameWithTickets> {
    let game = await db.kenoGame.findFirst({
      where: {
        endAt: { gt: new Date() },
        branchId,
      },
      orderBy: { endAt: "asc" },
      include: {
        tickets: { include: {selections: true}, orderBy: { createdAt: "desc" },  },
      },
    });
  
    if (!game) {
      game = await createNewKenoGame(branchId);
    }  
    return game;
  
  }
  
  // Create a new game entry
  export async function createNewKenoGame(
    branchId: string
  ): Promise<IKenoGameWithTickets> {
    const kenoGameId = await generateKenoGameId();
  
    const {
      startAt,
      ticketWillBeDisabledAt,
      winningNumberWillBeGeneratedAt,
      endAt,
    } = generateGameLogicTimes();
  
    return await db.kenoGame.create({
      data: {
        kenoGameId,
        branchId,
        startAt,
        ticketWillBeDisabledAt,
        winningNumberWillBeGeneratedAt,
        endAt, 
        winningNumbers: [],
      },
      include: {
        tickets: { include: {selections: true} },

      },
    });
  }


    