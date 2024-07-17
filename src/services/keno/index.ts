import { v4 as uuidv4 } from "uuid";
import db from "../../lib/db";
import { kenoGameConstants } from "../../utils/constants/kenoGameConstants";
import { GameType } from "@prisma/client";
import { IKenoGameTimeConfigurations } from "../../utils/shared/shared-types/keno";
import ShortUniqueId = require("short-unique-id");

// Custom options for generating v4 UUIDs
const v4options = {
  random: [0x91, 0x56, 0xbe],
};

// Utility function to generate unique random numbers
export function generateUniqueRandomNumbers(
  totalNumberToGenerate: number,
  numberStartFrom: number,
  numberEnd: number
): number[] {
  const numbers = [];

  while (numbers.length <= totalNumberToGenerate) {
    const randomNum =
      Math.floor(Math.random() * (numberEnd - numberStartFrom + 1)) +
      numberStartFrom;
    if (!numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }
  return Array.from(numbers);
}

// Create a new game entry
export function generateGameLogicTimes(): IKenoGameTimeConfigurations {
  const now = new Date();

  const waitTimeInMillSeconds =
    kenoGameConstants.totalGameWaitTimeInSeconds * 1000;
  const totalGameTimeInMillSeconds =
    kenoGameConstants.totalGameTimeInSeconds * 1000;

  const ticketWillBeDisabledAt = new Date(Date.now() + waitTimeInMillSeconds);

  const _beforeShowingInMill =
    kenoGameConstants.totalSecondsBeforeShowingWinningNumber * 1000;
  const winningNumberWillBeShowedAt = new Date(
    Date.now() + _beforeShowingInMill
  );

  const endAt = new Date(Date.now() + totalGameTimeInMillSeconds);

  return {
    startAt: now,
    ticketWillBeDisabledAt,
    winningNumberWillBeShowedAt,
    endAt,
  };
}

export function getGamePrefix(gameType: GameType,): string {
  

  switch (gameType) {
    case GameType.DOG_RACING:
      return "DR";
    case GameType.HORSE_RASING:
      return "HR";
    case GameType.KENO:
      return "KG";
    default:
      return "GM";
  }
}

// Define custom function to generate ticket ID with prefix and 10 digits
export async function generateUniqueIdForAGame(
  gameType: GameType,
  branchId: string
) {

  const branchPrefix =
    branchId.charAt(0) + branchId.charAt(branchId.length - 1);
  const prefix = `${getGamePrefix(gameType)}${branchPrefix}`.toUpperCase();

  let generatedId;
  do {
    const { randomUUID } = new ShortUniqueId({ length: 5 });
    const randomNumbers = getRandomNumbers();
    
    // Concatenate the parts with a hyphen in between
    generatedId = `${prefix}-${randomUUID()}-${randomNumbers}`;
  } while (await db.game.findFirst({ where: { uniqueId: {
      equals: generatedId,
    mode: 'insensitive'
  } } }));
  return generatedId.toUpperCase();
  
}

// Define custom function to generate ticket ID with prefix and 10 digits
export async function generateTicketId( gameType: GameType) { 
  const prefix = `${getGamePrefix(gameType)}T-`.toUpperCase();

  // const prefix = gameUniqueId.slice(0, 3) + "T-" + gameUniqueId.slice(-5).toUpperCase();

  let generatedId;
  do {
    generatedId = `${prefix}-${uuidv4(v4options)}`;

    const { randomUUID } = new ShortUniqueId({ length: 6 });
    const randomNumbers = getRandomNumbers();

    // Concatenate the parts with a hyphen in between
    generatedId = `${prefix}-${randomUUID()}-${randomNumbers}`.toUpperCase();
  } while (await db.ticket.findFirst({ where: { uniqueId: {
    equals: generatedId,
    mode: 'insensitive'
  } } }));
  return generatedId.toUpperCase();
}


export function getRandomNumbers(): string {
  const { randomUUID } = new ShortUniqueId({
    length: 6,
    dictionary: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  });
  return randomUUID();
}