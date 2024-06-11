import { Request, Response } from "express";  
import db from "../../lib/db"; 
import { kenoGameConstants } from "../../utils/constants/kenoGameConstants";
import { IKenoGameConfigurations } from "../../utils/types/keno";
import { getOrCreateCurrentKenoGame } from "../../services/keno/gameLogics";
 
export const getKenoGameConfigurations = async (req: Request, res: Response) => {
  try {

    const configuration : IKenoGameConfigurations = {
      startNumber: kenoGameConstants.startNumber,
      endNumber: kenoGameConstants.endNumber,
      minBetAmount: kenoGameConstants.minBetAmount,
      maxBetAmount: kenoGameConstants.maxBetAmount,
      minTIcketNumbersCount: kenoGameConstants.minNumberOfTicketsToSelect,
      maxTIcketNumbersCount: kenoGameConstants.maxNumberOfTicketsToSelect,
      
      numberOfWinningNumbers: kenoGameConstants.numberOfWinningNumbersToGenerate,
      secondsBeforeGeneratingWinningNumbers: kenoGameConstants.totalTimeBeforeGeneratingWinningNumbersInSeconds,
      showWinningNumberTimePerNumber: kenoGameConstants.singleWinningNumberShowTimeInSeconds,
      kenoPayoutMultiplier: kenoGameConstants.payoutTable
    }
    return res.status(201).json(configuration);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error });
  }
}; 


export const currentKenoGameOfBranch = async (req: Request, res: Response) => {
  try {
    const  branchId  = req.params.branchId;
     
    const game = await getOrCreateCurrentKenoGame(branchId); 

    let previousGame = await db.kenoGame.findFirst({
      where: {
        startAt: { lt: new Date(game.startAt) },
        branchId,
        tickets: {
         every: {}
        }
      },
      orderBy: { startAt: "desc" },
      include: {
        tickets: { include: {selections: true}, orderBy: { createdAt: "desc" },  },

      },
    });
   
    
    return res.status(201).json({current: game, previous: previousGame });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ error });
  }
}; 



export const getGameDetail = async (req: Request, res: Response) => {
  try {
    const  gameId = req.params.gameId;

    if(!gameId) {
      throw new Error("game id is required")
    }


    let game = await db.kenoGame.findFirst({
      where: { id: String(gameId),  }, 
      include: {
        tickets: { include: {selections: true}, orderBy: { createdAt: "desc" },  },

      },
    });
  
    if (!game) {
      throw new Error("Invalid game id provided")
    }  
 
   
    return res.status(201).json(game);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json( error );
  }
}; 



export const previousGames = async (req: Request, res: Response) => {
  try {

    const  branchId  = req.params.branchId;

   
    let games = await db.kenoGame.findMany({
      where: {
        branchId,
        startAt: {
          lte: new Date()
        }
      },
      include: {
        tickets: { include: {selections: true}, orderBy: { createdAt: "desc" },  },

      },
    });
 
    
  
       
    return res.status(201).json(games);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json( error );
  }
}; 