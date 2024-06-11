import { kenoPayouts } from "../../utils/constants/kenoGameConstants";
 

 

export const getPayoutMultiplier = (selectionCount: number, hitCount: number) => {
  const payout = kenoPayouts[selectionCount - 1];
  const index = payout.hits.indexOf(hitCount);
  return index !== -1 ? payout.pays[index] : 0;
};

export const getBetSlipStatusAndWin = (betSlip: any, winningNumbers: number[]) => {
  const { selectedNumbers, betAmount } = betSlip;
  const hitCount = selectedNumbers.filter(num => winningNumbers.includes(num)).length;
  const payoutMultiplier = getPayoutMultiplier(selectedNumbers.length, hitCount);
  const winAmount = payoutMultiplier * betAmount;
  return {
    status: winAmount > 0 ? "WIN" : "LOSE",
    winAmount,
  };
};