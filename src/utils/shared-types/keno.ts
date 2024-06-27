 
import { IDBGame, IDBKenoGame, IDBTicket, IDBTicketPayment } from "./prisma-models";
import { IKenoTicketWithSelections } from "./ticketModels";

export interface IKenoTicket extends IDBTicket {
  kenoTicket: IKenoTicketWithSelections; 
  payment?: IDBTicketPayment;
}

export interface IKenoGame extends IDBGame {
  keno: IDBKenoGame, 
  tickets: IKenoTicket[]
}



export interface IKenoGameForPlay extends IDBGame {
  keno: IDBKenoGame,  
}


export interface ICurrentKenoGamesResponse {
  cashierGame: IKenoGame;
  current: IKenoGame;
  previous?: IKenoGameForPlay;
  previousWinningNumbers: IKenoPreviousWinningNumbers[]
}

export interface ISelectionPayout {
  numberSelection: number;
  payoutMultiplier: number;
}

export interface IKenoGameConfigurations {
  startNumber: number;
  endNumber: number;

  minBetAmount: number;
  maxBetAmount: number;

  minNumbersCountPerSlip: number;
  maxNumbersCountPerSlip: number;

  secondsBeforeStartingGame: number;
  secondsBeforeShowingWinningNumbers: number;


  secondsToDisplaySingleWinningNumber: number;
  numberOfWinningNumbersPerGame: number;

  totalSecondsBeforeShowingWinningNumber: number;
  totalGameWaitTimeInSeconds: number;
  totalGameTimeInSeconds: number;
  kenoPayoutMultiplier: IKenoPayout[]; 
}

export interface IKenoGameTimeConfigurations {
  startAt: Date;
  ticketWillBeDisabledAt: Date;
  winningNumberWillBeShowedAt: Date;
  endAt: Date;
}

export interface IKenoPayoutTable {
  selection: number,
  payouts:  IKenoPayoutOfSelection[]
}

export interface IKenoPayoutOfSelection {
  hit: number; 
  pay: number;
}

export interface IKenoPayout {
  hits: number[],
  pays: number[]
}


export interface IKenoPreviousWinningNumbers {
  gameId: string;
  winningNumbers: number[]
}