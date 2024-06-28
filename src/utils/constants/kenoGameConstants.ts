import { IKenoGameConfigurations, IKenoPayout, IKenoPayoutTable } from "../shared/shared-types/keno"


export const kenoPayouts : IKenoPayout[] = [                
    {hits: [1],               pays: [3.80],                          },  //PAYOUTS FOR 1 NUMBERS
    {hits: [2,1],             pays: [15],                          },  //PAYOUTS FOR 2 NUMBERS
    {hits: [3,2],             pays: [35,5],                        },  //PAYOUTS FOR 3 NUMBERS
    {hits: [4,3,2],           pays: [100,8,1],                     },  //PAYOUTS FOR 4 NUMBERS
    {hits: [5,4,3,2],         pays: [300,15,3, 1],               },  //PAYOUTS FOR 5 NUMBERS
    {hits: [6,5,4,3],         pays: [1800,70,10,1],                },  //PAYOUTS FOR 6 NUMBERS
    {hits: [7,6,5,4,3],       pays: [2150,120,12,6,1],             },  //PAYOUTS FOR 7 NUMBERS
    {hits: [8,7,6,5,4],       pays: [3000,600,68,8,4],             },  //PAYOUTS FOR 8 NUMBERS
    {hits: [9,8,7,6,5,4],     pays: [4200,1800,120,18,6,3],        },  //PAYOUTS FOR 9 NUMBERS
    {hits: [10,9,8,7,6,5,4],  pays: [5000,2500,400,40,12,4,2],   },  //PAYOUTS FOR 10 NUMBERS
]

const numberOfWinningNumbersPerGame = 20;
const secondsToDisplaySingleWinningNumber = 3;
const totalTimeForShowingWinningTickets = numberOfWinningNumbersPerGame * secondsToDisplaySingleWinningNumber;

const secondsBeforeStartingGame = 5;

const totalGameWaitTimeInSeconds = secondsBeforeStartingGame + 180;

const secondsBeforeShowingWinningNumbers = 2;

const totalSecondsBeforeShowingWinningNumber = totalGameWaitTimeInSeconds + secondsBeforeShowingWinningNumbers;

const totalGameTimeInSeconds = totalSecondsBeforeShowingWinningNumber  + totalTimeForShowingWinningTickets;

export const kenoGameConstants: IKenoGameConfigurations = {
    startNumber: 1,
    endNumber: 80,

    minBetAmount: 20,
    maxBetAmount: 5000, 

    minNumbersCountPerSlip: 2,
    maxNumbersCountPerSlip: 10, 

    numberOfWinningNumbersPerGame, 
    secondsToDisplaySingleWinningNumber,

    secondsBeforeStartingGame,
    secondsBeforeShowingWinningNumbers,
    
    totalSecondsBeforeShowingWinningNumber,
    totalGameWaitTimeInSeconds,
    totalGameTimeInSeconds,

    kenoPayoutMultiplier: kenoPayouts
}




// export const kenoPayouts = [                
//     {hits: [1],           pays: [3.80],                            occurrence: [0]},                   //PAYOUTS FOR 1 NUMBERS
//     {hits: [2,1],           pays: [15],                            occurrence: [20,80]},               //PAYOUTS FOR 2 NUMBERS
//     {hits: [3,2],           pays: [35,5],                           occurrence: [20,80]},               //PAYOUTS FOR 3 NUMBERS
//     {hits: [4,3,2],         pays: [100,8,1],                         occurrence: [10,30,60]},            //PAYOUTS FOR 4 NUMBERS
//     {hits: [5,4,3,2],         pays: [300,15,3, 1],                       occurrence: [10,30,60]},            //PAYOUTS FOR 5 NUMBERS
//     {hits: [6,5,4,3],       pays: [1800,70,10,1],                    occurrence: [10,20,30,40]},         //PAYOUTS FOR 6 NUMBERS
//     {hits: [7,6,5,4,3],     pays: [2150,120,12,6,1],                occurrence: [5,10,20,30,35]},       //PAYOUTS FOR 7 NUMBERS
//     {hits: [8,7,6,5,4],     pays: [3000,600,68,8,4],            occurrence: [5,10,20,30,35]},       //PAYOUTS FOR 8 NUMBERS
//     {hits: [9,8,7,6,5,4],   pays: [4200,1800,120,18,6,3],          occurrence: [1,4,10,20,30,35]},     //PAYOUTS FOR 9 NUMBERS
//     {hits: [10,9,8,7,6,5,4],  pays: [5000,2500,400,40,12,4,2],       occurrence: [1,4,10,15,30,40]}      //PAYOUTS FOR 10 NUMBERS

// ]
