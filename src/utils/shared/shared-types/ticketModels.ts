import {
  IDBDogRacingTicket,
  IDBKenoTicket,
  IDBTicket,
  IDBTicketPayment,
  IDBTicketSelection,
} from "./prisma-models";
import { ICashier } from "./userModels";
import { IGame } from "./gameModels";

export interface IKenoTicketWithSelections extends IDBKenoTicket {
  selections: IDBTicketSelection[];
}
export interface IKenoGameTicket extends IDBTicket {
  kenoTicket: IKenoTicketWithSelections;
}

export interface IKenoTicketWithSelections extends IDBKenoTicket {
  selections: IDBTicketSelection[];
}

export interface ITicketPayment extends IDBTicketPayment { 
  cashier: ICashier;
}



export interface ITicket extends IDBTicket {
  kenoTicket?: IKenoTicketWithSelections;
  dogRacingTicket?: IDBDogRacingTicket;
  payment?: ITicketPayment;
}

export interface ITicketWithDetail extends ITicket {
  game: IGame;
  cashier: ICashier;

 kenoTicket?: IKenoTicketWithSelections;
  dogRacingTicket?: IDBDogRacingTicket;
  payment?: ITicketPayment;
}
