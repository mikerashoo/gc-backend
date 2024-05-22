import { Request, Response } from "express";  
import db from "../../lib/db";
import { kenoPayoutMultiplier, getOrCreateCurrentKenoGame, checkAndGenerateWinningNumbers } from "../../services/keno-game-services";
import { kenoGameConstants } from "../../utils/constants/kenoGameConstants";
import { IKenoGameConfigurations } from "../../utils/types/keno";
 
export const getKenoGameConfigurations = async (req: Request, res: Response) => {
  try {
   
    
    const configuration : IKenoGameConfigurations = {
      startNumber: kenoGameConstants.startNumber,
      endNumber: kenoGameConstants.endNumber,
      minBetAbout: kenoGameConstants.minBetAmount,
      maxBetAbout: kenoGameConstants.maxBetAmount,
      minTIcketNumbersCount: kenoGameConstants.minNumberOfTicketsToSelect,
      maxTIcketNumbersCount: kenoGameConstants.maxNumberOfTicketsToSelect,
      
      numberOfWinningNumbers: kenoGameConstants.numberOfWinningNumbersToGenerate,
      secondsBeforeGeneratingWinningNumbers: kenoGameConstants.totalTimeBeforeGeneratingWinningNumbersInSeconds,
      showWinningNumberTimePerNumber: kenoGameConstants.singleWinningNumberShowTimeInSeconds,
      kenoPayoutMultiplier: kenoPayoutMultiplier
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
        endAt: { lt: new Date(game.endAt) },
        branchId,
      },
      orderBy: { endAt: "desc" },
      include: {
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });
  
    if (previousGame) { 
      previousGame = await checkAndGenerateWinningNumbers(previousGame);
    }

    
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
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });
  
    if (!game) {
      throw new Error("Invalid game id provided")
    }  

    game = await checkAndGenerateWinningNumbers(game);
   
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
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });

    for (let game of games) {
     
    game = await checkAndGenerateWinningNumbers(game);
      
    };
    
  
       
    return res.status(201).json(games);
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json( error );
  }
}; 