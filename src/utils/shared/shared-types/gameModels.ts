import { IKenoTicket } from "./keno";
import { IDBBranch, IDBDogRacingGame, IDBGame, IDBKenoGame } from "./prisma-models"; 
import { ITicket, ITicketWithDetail } from "./ticketModels";

export interface IGame extends IDBGame{
    keno: IDBKenoGame,
    dogRacing: IDBDogRacingGame,
    branch: IDBBranch 
  }

 

 

export interface IGameForPlay extends IDBGame{
    keno?: IDBKenoGame,
    dogRacing?: IDBDogRacingGame,
    tickets: ITicket[]
  }


export interface ICashierReport {
  totalTickets: number;
  totalTicketsCancelled: number;
  totalMoneyCollected: number;
  totalMoneyPaid: number;
  totalMoneyToBePaid: number;
  remainingCash: number;
  tickets: ITicketWithDetail[]

}