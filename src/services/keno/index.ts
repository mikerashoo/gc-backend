  
  import { v4 as uuidv4 } from "uuid";  
import db from "../../lib/db";
import {  IKenoGameTimeConfigurations } from "../../utils/types/keno";  
import { kenoGameConstants } from "../../utils/constants/kenoGameConstants";
  
  // Custom options for generating v4 UUIDs
  const v4options = {
    random: [0x91, 0x56, 0xbe],
  };
  

  // Utility function to generate unique random numbers
export function generateUniqueRandomNumbers (totalNumberToGenerate: number, numberStartFrom: number, numberEnd: number): number[] {
  const numbers = [];

  while (numbers.length <= totalNumberToGenerate) {
    const randomNum = Math.floor(Math.random() * (numberEnd - numberStartFrom + 1)) + numberStartFrom;
    if(!numbers.includes(randomNum)){
      numbers.push(randomNum);

    }
  }
  return Array.from(numbers);
}
  
 

  // Create a new game entry
  export function generateGameLogicTimes(): IKenoGameTimeConfigurations {
    const startAt = new Date();
    const winningNumberWillBeGeneratedAt = new Date(
      Date.now() +
        kenoGameConstants.totalTimeBeforeGeneratingWinningNumbersInSeconds * 1000
    );
  
    const totalSecondsBeforeDisablingTickets =
      kenoGameConstants.totalTimeBeforeGeneratingWinningNumbersInSeconds -
      kenoGameConstants.disableTicketBeforeGeneratingTimeInSeconds;
  
    const ticketWillBeDisabledAt = new Date(
      Date.now() + totalSecondsBeforeDisablingTickets * 1000
    );
  
    // winning numbers
  
    const totalTimeToShowTickets =
      kenoGameConstants.numberOfWinningNumbersToGenerate *
      kenoGameConstants.singleWinningNumberShowTimeInSeconds;
  
    const totalGameTimeInSeconds =
      totalTimeToShowTickets +
      kenoGameConstants.totalTimeBeforeGeneratingWinningNumbersInSeconds;
  
    const endAt = new Date(Date.now() + totalGameTimeInSeconds * 1000);
  
    return {
      startAt,
      ticketWillBeDisabledAt,
      winningNumberWillBeGeneratedAt,
      endAt,
    };
  } 
  
  // Define custom function to generate ticket ID with prefix and 10 digits
  export async function generateKenoGameId() {
    const prefix = "KG";
  
    let generatedId;
    do {
      generatedId = `${prefix}-${uuidv4(v4options)}`;
  
      const uuid = uuidv4();
      const parts = uuid.split("-"); // Split UUID into parts
  
      // Take the first and third parts, each consisting of 4 characters
      const firstPart = parts[0].slice(0, 4);
      const secondPart = parts[2].slice(0, 4);
  
      // Concatenate the parts with a hyphen in between
      generatedId = `${prefix}-${firstPart}-${secondPart}`;
    } while (
      await db.kenoGame.findFirst({ where: { kenoGameId: generatedId } })
    );
    return generatedId;
  }
  
  // Define custom function to generate ticket ID with prefix and 10 digits
  export async function generateTicketId(kenoGameId: string) {
    const prefix = "KT-" + kenoGameId.slice(-4);
  
    let generatedId;
    do {
      generatedId = `${prefix}-${uuidv4(v4options)}`;
  
      const uuid = uuidv4();
  
      // Take the first and third parts, each consisting of 4 characters
      const firstPart = uuid.slice(0, 4);
  
      // Concatenate the parts with a hyphen in between
      generatedId = `${prefix}-${firstPart}`;
    } while (
      await db.ticket.findFirst({ where: { kenoTicketId: generatedId } })
    );
    return generatedId;
  }
  
   
  