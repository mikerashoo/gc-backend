import db from "../../lib/db";
import { generateTicketId, generateSelectionsPayouts, checkAndGenerateWinningNumbers } from "../../services/keno-game-services";

 

export const createTicket = async (req: any, res: any) => {
  try {
    if (!req.payload) {
      return res.status(401).json({ error: "Un-Authorized" });
    }
  
    const cashierId = req.payload.userId;
    const gameId = req.params.gameId;
      const game = await db.kenoGame.findUnique({
      where: {
        id: gameId,
      },
    }); 

    if (!game) {
      return res.status(400).json({ error: "Invalid game", message: "Game is not found" });
    }

    else if(game.ticketWillBeDisabledAt < new Date()) {
      return res.status(400).json({ error: "Invalid game", message: "Ticket is disabled for the game" });
      
    }
    
    const { selectedNumbers, betAmount, winAmount } = req.body;

    
    const kenoTicketId = await generateTicketId(game.kenoGameId);

    let nCount = selectedNumbers.length;
    const payoutsArray = generateSelectionsPayouts();

    const payoutMultiplier = payoutsArray.find(
      (payout) => payout.numberSelection == nCount
    )!.payoutMultiplier;
    const _winAmount = payoutMultiplier * betAmount;

    if (_winAmount != winAmount) {
      return res.status(403).json({ error: "Invalid winning amount", message: "win amount should be " + _winAmount });
    }

    // Save the ticket to the database
    const ticket = await db.ticket.create({
      data: {
        gameId: gameId,
        cashierId,
        numbers: selectedNumbers,
        betAmount,
        kenoTicketId,
        winAmount: winAmount,
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
        id: gameId
      }, 
      include: {
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!game) {
      return res.status(400).json({ error: "Invalid game", message: "Game is not found" });
    }
 
    game = await checkAndGenerateWinningNumbers(game);
 
      // Fetch ended games with associated tickets
      let tickets = await db.ticket.findMany({
        where: {
          gameId: gameId
        }, 
        include: {
          game: true,
        },

      });
  
 
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const searchTIcketByKenoGameId = async (req: any, res: any) => {
  try {
    const { kenoTicketId  } = req.body;
    
    const  branchId  = req.params.branchId;

    // Fetch ended games with associated tickets
    let tickets = await db.ticket.findMany({
      where: {
        kenoTicketId: {
          contains: kenoTicketId,
          mode: 'insensitive'
        },
        game: {
          branchId
        }
      }, 
      include: {
        game:true,
      },
    });
 
 
    return res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
