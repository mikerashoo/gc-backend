import { GameType, TicketStatus, User } from "@prisma/client"; 
import db from "../../../lib/db";
import { generateTicketId } from "../../../services/keno";
import { ticketDetailInclude } from "../../../services/keno/ticketLogics";
import { kenoGameConstants } from "../../../utils/constants/kenoGameConstants";
import { IKenoTicketCreateData, ITicketByIdSchema, ITicketPaymentSchema } from "../../../utils/shared/schemas/kenoSchemas";
import { ITicketWithDetail } from "../../../utils/shared/shared-types/ticketModels";

export const createTicket = async (req: any, res: any) => {
  try {
    if (!req.payload) {
      return res.status(401).json({ error: "Un-Authorized" });
    }

    const cashierId = req.payload.accountId;
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

    const uniqueId = await generateTicketId(game.gameType);
 

    // Save the ticket to the database
    const ticket = await db.ticket.create({
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
      include: ticketDetailInclude,
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
    let game = await db.game.findUnique({
      where: {
        id: gameId,
      },
      include: {
        tickets: {
          include: ticketDetailInclude,
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

export const searchTIcketByUniqueId = async (req: any, res: any) => {
  try {
    const { ticketId } = req.query;

    if (!ticketId) {
      return res.status(403).json({
        error: "Invalid request",
        message: "ticketId is required",
      });
    }

    const shopId = req.payload.shopId;

    // Fetch ended games with associated tickets
    let ticket = await db.ticket.findFirst({
      where: {
        uniqueId: { 
          contains: ticketId,
          mode: "insensitive",
        },
        game: {
          shopId,
        },
      },
      include: ticketDetailInclude,
    });
 
    if(!ticket){ 
        return res.status(403).json({
          error: "Invalid ticket id",
          message: "Ticket with given id not found",
        }); 
    }

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getKenoTicketDetail = async (req: any, res: any) => {
  try {
    const shopId = req.payload.shopId;
    const ticketId = req.params.ticketId;

    // Fetch ended games with associated tickets
    let ticket = await db.ticket.findUnique({
      where: {
        id: ticketId,
        game: {
          shopId,
        },
      },
      include: ticketDetailInclude,
    });

    return res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTodaysTickets = async (req: any, res: any) => {
  try {
    const shopId = req.payload.shopId;
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
    let tickets: ITicketWithDetail[] = await db.ticket.findMany({
      where: {
        cashierId,
        game: {
          shopId,
        },
        createdAt: {
          gte: startOfDay.toISOString(),
          lt: endOfDay.toISOString(),
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        game: {
          include: {
            shop: true,
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
        cashier: true 
      }
      // include: ticketDetailInclude,
    });

    select: {
      password: false
    }
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markKenoTicketAsPaid = async (req: any, res: any) => {
  try {
    const shopId = req.payload.shopId;
    const cashierId = req.payload.accountId;

    const { paidAmount, ticketId } = req.body as ITicketPaymentSchema;

    // Fetch ended games with associated tickets
    let ticketExits = await db.ticket.findUnique({
      where: {
        id: ticketId,
        game: {
          shopId,
        },
      },
    });

    if (!ticketExits) {
      return res.status(404).json({
        error: "Invalid ticket id",
        message: "ticket not exits",
      });
    }

    if (
      ticketExits.status != TicketStatus.WIN ||
      ticketExits.winAmount != paidAmount
    ) {
      return res.status(403).json({
        error: "Invalid ticket",
        message:
          "Only Tickets with winning status and winning amount greater than 0 are allowed to pay " +
          "Current ticket is " +
          ticketExits.status,
      });
    }
    let updatedTicket: ITicketWithDetail = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
        payment: {
          create: {
            cashierId,
            paidAmount,
          },
        },
      },
      include: ticketDetailInclude,
    });
    return res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelTicket = async (req: any, res: any) => {
  try {
    const shopId = req.payload.shopId;
    const cashierId = req.payload.accountId;

    const { ticketId } = req.body as ITicketByIdSchema;

    // Fetch ended games with associated tickets
    let ticketExits = await db.ticket.findUnique({
      where: {
        id: ticketId,
        game: {
          shopId,
        },
      },
    });

    if (!ticketExits) {
      return res.status(404).json({
        error: "Invalid ticket id",
        message: "ticket not exits",
      });
    }

    if (ticketExits.status != TicketStatus.ON_PLAY) {
      return res.status(403).json({
        error: "Invalid ticket",
        message:
          "Only On play Tickets are allowed " +
          "Current ticket is " +
          ticketExits.status,
      });
    }
    let updatedTicket: ITicketWithDetail = await db.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelledCashierId: cashierId,
        
      },
      include: ticketDetailInclude,
    });
    return res.status(200).json(updatedTicket);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
