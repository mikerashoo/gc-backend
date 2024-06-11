
export interface ISelectionPayout {
  numberSelection: number;
  payoutMultiplier: number;
}

export interface IKenoGameConfigurations {
  startNumber: number;
  endNumber: number;
  minBetAmount: number;
  maxBetAmount: number;
  minTIcketNumbersCount: number;
  maxTIcketNumbersCount: number;
  showWinningNumberTimePerNumber: number;
  numberOfWinningNumbers: number;
  secondsBeforeGeneratingWinningNumbers: number;
  kenoPayoutMultiplier: IKenoPayout[]; 
}

export interface IKenoGameTimeConfigurations {
  startAt: Date;
  ticketWillBeDisabledAt: Date;
  winningNumberWillBeGeneratedAt: Date;
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