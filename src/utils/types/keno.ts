// src/types/index.ts 

import { KenoGame, Ticket } from "@prisma/client";

export type GameUpdateData = {
  game: KenoGameWithTickets;
  previousGame: KenoGameWithTickets | null;
  counter: number | null;
  ticketAllowed: boolean;
  currentNumber: number | null;
  displayedNumbers: number[];
  payoutsArray: ISelectionPayout[];
};

export type KenoGameWithTickets = {
  tickets: Ticket[];
} & KenoGame;

export interface ISelectionPayout {
  numberSelection: number;
  payoutMultiplier: number;
}

export interface IKenoGameConfigurations {
  startNumber: number;
  endNumber: number;
  minBetAbout: number;
  maxBetAbout: number;
  minTIcketNumbersCount: number;
  maxTIcketNumbersCount: number;
  showWinningNumberTimePerNumber: number;
  numberOfWinningNumbers: number;
  secondsBeforeGeneratingWinningNumbers: number;
  kenoPayoutMultiplier: ISelectionPayout[];

}

export interface IKenoGameTimeConfigurations {
  startAt: Date;
  ticketWillBeDisabledAt: Date;
  winningNumberWillBeGeneratedAt: Date;
  endAt: Date;
}
