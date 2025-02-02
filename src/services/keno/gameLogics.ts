import { GameStatus, GameType } from "@prisma/client";
import { generateUniqueIdForAGame, generateGameLogicTimes } from ".";
import db from "../../lib/db";
import { IKenoGame, IKenoGameForPlay, IKenoPreviousWinningNumbers } from "../../utils/shared/shared-types/keno";
// Get or create the current game based on existing criteria
export async function getOrCreateCurrentKenoGame(
  shopId: string
): Promise<IKenoGame> { 

  let _game = await db.game.findFirst({
    where: {
      status: { not: GameStatus.DONE },
      gameType: GameType.KENO,
      shopId,
    },
   

    orderBy: { endAt: "asc" },
  });
  let game = null;

  if (!_game) {
    game = await createNewKenoGame(shopId);
  } else {
    game = await getKenoGameWithTickets(_game.id);
  }
  return game;
}

export async function getOrCreateCashierKenoGame(
  shopId: string
): Promise<IKenoGame> {
  
  let _game = await db.game.findFirst({
    where: { 
      status: GameStatus.NOT_STARTED,
      gameType: GameType.KENO,
      shopId,
    },
    orderBy: { endAt: "asc" },
   
  });
  let game = null;

  if (!_game) {
    game = await createNewKenoGame(shopId);
  } else {
    game = await getKenoGameWithTickets(_game.id);
  }
  return game;
}

// Create a new game entry
export async function createNewKenoGame(
  shopId: string,
): Promise<IKenoGame> {

  const shop = await db.shop.findUnique({
    where: {
      id: shopId,
    },
    select: {
      name: true,
     
    },
    // include: {
    //   provider:  true
    // }
  })

  const shopName = shop.name.trim();
 
  const uniqueId = await generateUniqueIdForAGame(GameType.KENO, shopName);

  const {
    startAt,
    ticketWillBeDisabledAt,
    winningNumberWillBeShowedAt,
    endAt,
  } = generateGameLogicTimes();

  let game = await db.game.create({
    data: {
      gameType: GameType.KENO,
      uniqueId,
      shopId,
      startAt,
      endAt,
      status: GameStatus.NOT_STARTED,

      keno: {
        create: {
          ticketWillBeDisabledAt,
          winningNumberWillBeShowedAt,
          winningNumbers: [],
        },
      },
    },
    select: {
      id: true,
    },
  });
  return await getKenoGameWithTickets(game.id);
}


export const getPreviousGameWinningNumbers = async (
  shopId: string
): Promise<IKenoPreviousWinningNumbers[]> => {
  try {

    let games = await db.game.findMany({
      where: {
        shopId,
        gameType: GameType.KENO,
        status: GameStatus.DONE, 
      },
      select: {
        uniqueId: true,
        keno: {
          select: {
            winningNumbers: true,
          },
        },
      },
      take: 10,
      orderBy: {
        startAt: "desc",
      },
    });

    const gameWithTickets = games.map((game) => {
      return {
        gameId: game.uniqueId.slice(game.uniqueId.length - 5),
        winningNumbers: game.keno.winningNumbers.sort((a, b) => a - b),
      };
    });
    return gameWithTickets; 
  } catch (error) {
     throw error
  }
};

// Create a new game entry
export async function getKenoGameWithTickets(
  id: string
): Promise<IKenoGame> {
  let game = await db.game.findFirst({
    where: {
      id,
      gameType: GameType.KENO,
    },
    include: {
      keno: true,
      tickets: {
        include: {
          kenoTicket: {
            include: {
              selections: true
            }
          },
          payment: true
        }
      }
    },
  });

  return game;
}
