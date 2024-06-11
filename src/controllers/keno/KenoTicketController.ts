import { TicketStatus } from "@prisma/client";
import db from "../../lib/db";
import {
  generateTicketId,
} from "../../services/keno";
import { IKenoTicketCreateData } from "../../utils/schemas/kenoSchemas"; 
import { kenoGameConstants } from "../../utils/constants/kenoGameConstants";

export const createTicket = async (req: any, res: any) => {
  try {
    if (!req.payload) {
      return res.status(401).json({ error: "Un-Authorized" });
    }

    const cashierId = req.payload.accountId;
    const gameId = req.params.gameId;
    const game = await db.kenoGame.findUnique({
      where: {
        id: gameId,
      },
    });

    if (!game) {
      return res
        .status(400)
        .json({ error: "Invalid game", message: "Game is not found" });
    } else if (game.ticketWillBeDisabledAt < new Date()) {
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

      const payout = kenoGameConstants.payoutTable.find(
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

    const kenoTicketId = await generateTicketId(game.kenoGameId); 

    // Save the ticket to the database
    const ticket = await db.ticket.create({
      data: {
        gameId,
        kenoTicketId,
        cashierId,
        possibleWinAmount,
        totalBetAmount,
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
      include: {
        game: true,
        selections: true,
        cashier: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res.status(201).json(ticket);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error });
  }
};

export const getGameTickets = async (req: any, res: any) => {
  try {
    const gameId = req.params.gameId;
    // Fetch ended games with associated tickets
    let game = await db.kenoGame.findUnique({
      where: {
        id: gameId,
      },
      include: {
        tickets: {
          include: { selections: true, game: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!game) {
      return res
        .status(400)
        .json({ error: "Invalid game", message: "Game is not found" });
    }

    // Fetch ended games with associated tickets
    let tickets = game.tickets;

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchTIcketByKenoGameId = async (req: any, res: any) => {
  try {
    const kenoTicketId = req.query.kenoTicketId;

    if (!kenoTicketId) {
      return res.status(403).json({
        error: "Invalid request",
        message: "kenoTicketId is required",
      });
    }

    const branchId = req.params.branchId;

    // Fetch ended games with associated tickets
    let tickets = await db.ticket.findMany({
      where: {
        kenoTicketId: {
          contains: kenoTicketId,
          mode: "insensitive",
        },
        game: {
          branchId,
        },
      },
      include: {
        game: true,
        selections: true,
      },
    });

    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getKenoTicketDetail = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;
    const ticketId = req.params.ticketId;

    // Fetch ended games with associated tickets
    let ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
        game: {
          branchId,
        },
      },
      include: {
        game: true,
        selections: true,
        cashier: {
          include: {
            profile: true,
          },
        },
      },
    });
 
    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTodaysTickets = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;
    const cashierId = req.payload.accountId;

    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    // Fetch ended games with associated tickets
    let tickets = await db.ticket.findMany({
      where: {
        cashierId,
        game: {
          branchId,
        },
        createdAt: {
          gte: startOfDay.toISOString(),
          lt: endOfDay.toISOString(),
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        game: true,
        selections: true,
        cashier: {
          include: {
            profile: true,
          },
        },
      },
    });
 
    
 
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markKenoTicketAsPayed = async (req: any, res: any) => {
  try {
    const branchId = req.params.branchId;
    const ticketId = req.params.ticketId;

    // Fetch ended games with associated tickets
    let ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
        game: {
          branchId,
        },
      },
      include: {
        game: true,
        cashier: true,
        selections: true,
      },
    });

    if (
      ticket
    ) {
      return res.status(404).json({
        error: "Invalid ticket id",
        message: 'ticket not exits',
      });
    }

    if (ticket.status != TicketStatus.WIN) {
      return res.status(403).json({
        error: "Invalid ticket status",
        message:
          "Only Tickets with winning status are allowed to pay " +
          "Current ticket is " +
          ticket.status,
      });
    } 
    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
