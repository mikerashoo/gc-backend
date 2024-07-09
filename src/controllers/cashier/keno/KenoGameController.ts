import { GameStatus, GameType } from "@prisma/client"; 
import db from "../../../lib/db";
import { generateTicketId } from "../../../services/keno";
import {
  getOrCreateCurrentKenoGame,
  getOrCreateCashierKenoGame,
  getPreviousGameWinningNumbers,
  getKenoGameWithTickets,
} from "../../../services/keno/gameLogics";
import { getKenoTicket } from "../../../services/keno/ticketLogics";
import { kenoGameConstants } from "../../../utils/constants/kenoGameConstants";
import { IKenoTicketCreateData } from "../../../utils/shared/schemas/kenoSchemas";
import {
  IKenoGameConfigurations,
  ICurrentKenoGamesResponse,
} from "../../../utils/shared/shared-types/keno";

export const getKenoGameConfigurations = async (req: any, res: any) => {
  try {
    const configuration: IKenoGameConfigurations = kenoGameConstants;
    return res.status(201).json(configuration);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error });
  }
};

export const currentKenoGameOfBranch = async (req: any, res: any) => {
  try {
    const branchId = req.payload.branchId;

    const current = await getOrCreateCurrentKenoGame(branchId);

    let cashierGame = current;

    if (current.status != GameStatus.NOT_STARTED) {
      cashierGame = await getOrCreateCashierKenoGame(branchId);
    }

    let previous = await db.game.findFirst({
      where: {
        gameType: GameType.KENO,
        status: GameStatus.DONE,
        branchId,
      },
      orderBy: { startAt: "desc" },
      include: {
        keno: true,
      },
    });

    const previousWinningNumbers = await getPreviousGameWinningNumbers(
      branchId
    );

    const data: ICurrentKenoGamesResponse = {
      current,
      cashierGame,
      previous,
      previousWinningNumbers,
    };

    return res.status(201).json(data);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error });
  }
};

export const getGameDetail = async (req: any, res: any) => {
  try {
    const gameId = req.params.gameId;

    if (!gameId) {
      throw new Error("game id is required");
    }

    const game = await getKenoGameWithTickets(String(gameId));

    if (!game) {
      throw new Error("Invalid game id provided");
    }

    return res.status(201).json(game);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json(error);
  }
};

export const previousGames = async (req: any, res: any) => {
  try {
    const branchId = req.payload.branchId;

    let games = await db.game.findMany({
      where: {
        gameType: GameType.KENO,
        branchId,
        startAt: {
          lte: new Date(),
        },
      },
      include: {
        keno: true,
        tickets: {
          include: {
            kenoTicket: {
              include: { selections: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.status(201).json(games);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json(error);
  }
};

export const addKenoTicket = async (req: any, res: any) => {
  try {
    if (!req.payload) {
      return res.status(401).json({ error: "Un-Authorized" });
    }

    const cashierId = req.payload.cashierId;
    console.log("Cashier ID ", cashierId)
    const gameId = req.params.gameId;
    const game = await db.game.findUnique({
      where: {
        id: gameId,
        gameType: GameType.KENO,
      },
      include: {
        keno: true,
      },
    });

    if (!game) {
      return res
        .status(400)
        .json({ error: "Invalid game", message: "Game is not found" });
    } else if (game.keno.ticketWillBeDisabledAt < new Date()) {
      return res.status(400).json({
        error: "Invalid game",
        message: "Ticket is disabled for the game",
      });
    }

    let totalBetAmount = 0;
    let possibleWinAmount = 0;

    const { selections } = req.body as IKenoTicketCreateData;
    let index = 0;
    for (let selection of selections) {
      index++;
      const { selectedNumbers, betAmount, winAmount } = selection;

      let selectionCount = selectedNumbers.length;

      const payout = kenoGameConstants.kenoPayoutMultiplier.find(
        (payout) => payout.hits[0] == selectionCount
      );
      const payoutMultiplier = payout.pays[0];
      const _winAmount = payoutMultiplier * betAmount;
      if (_winAmount != winAmount) {
        return res.status(403).json({
          error: "Invalid winning amount for selection " + index,
          message: "win amount should be " + _winAmount,
        });
      }

      totalBetAmount += betAmount;
      possibleWinAmount += winAmount;
    }

    const uniqueId = await generateTicketId(game.uniqueId, game.gameType);

    // Save the ticket to the database
    const newTicket = await db.ticket.create({
      data: {
        gameId,
        uniqueId: uniqueId,
        cashierId,
        possibleWinAmount,
        totalBetAmount,
        kenoTicket: {
          create: {
            selections: {
              createMany: {
                data: selections.map((selection) => {
                  const { selectedNumbers, betAmount, winAmount } = selection;
                  return {
                    betAmount,
                    possibleWinAmount: winAmount,
                    selectedNumbers,
                  };
                }),
              },
            },
          },
        },
        
        
      },
    });

    const ticket = await getKenoTicket({ id: newTicket.id });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error });
  }
};
