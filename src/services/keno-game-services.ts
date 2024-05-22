  
  import { v4 as uuidv4 } from "uuid"; 
  import { KenoGameStatus, Ticket } from "@prisma/client"; 
import db from "../lib/db";
import { kenoGameConstants } from "../utils/constants/kenoGameConstants";
import { KenoGameWithTickets, IKenoGameTimeConfigurations, ISelectionPayout } from "../utils/types/keno";
import { number } from "zod";
  
  // Custom options for generating v4 UUIDs
  const v4options = {
    random: [0x91, 0x56, 0xbe],
  };
  
  // Get or create the current game based on existing criteria
  export async function getOrCreateCurrentKenoGame(
    branchId: string
  ): Promise<KenoGameWithTickets> {
    let game = await db.kenoGame.findFirst({
      where: {
        endAt: { gt: new Date() },
        branchId,
      },
      orderBy: { endAt: "asc" },
      include: {
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });
  
    if (!game) {
      game = await createNewKenoGame(branchId);
    } else {
      game = await checkAndGenerateWinningNumbers(game);
    }
  
    return game;
  }
  
  // Create a new game entry
  export async function createNewKenoGame(
    branchId: string
  ): Promise<KenoGameWithTickets> {
    const kenoGameId = await generateKenoGameId();
  
    const {
      startAt,
      ticketWillBeDisabledAt,
      winningNumberWillBeGeneratedAt,
      endAt,
    } = generateGameLogicTimes();
  
    return db.kenoGame.create({
      data: {
        kenoGameId,
        branchId,
        startAt,
        ticketWillBeDisabledAt,
        winningNumberWillBeGeneratedAt,
        endAt,
        status: KenoGameStatus.ON_PLAY,
        winningNumbers: [],
      },
      include: {
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });
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
  
  // Get or create the current game based on existing criteria
  export async function getPrevoisGame(
    endAt: Date
  ): Promise<KenoGameWithTickets> {
    let game = await db.kenoGame.findFirst({
      where: { endAt: { lt: endAt }, tickets: { some: {} } },
      orderBy: { endAt: "desc" },
      include: {
        tickets: { orderBy: { createdAt: "desc" } },
      },
    });
  
    if (game) {
      game = await checkAndGenerateWinningNumbers(game);
  
      game.tickets.map((ticket) => {
        if (ticket.status === "ON_PLAY") {
          return changeTicketStatus(ticket, game.winningNumbers);
        }
      });
    }
  
    return game;
  }
  
  // Generate winning numbers for the game
  export async function checkAndGenerateWinningNumbers(
    game: KenoGameWithTickets
  ): Promise<KenoGameWithTickets> {
    if (
      game.ticketWillBeDisabledAt <= new Date() &&
      game.winningNumbers.length === 0
    ) {
      // Generate winning numbers
      game = await generateWinningNumbers(game);
    }
  
    if (game.endAt <= new Date()) {
      // Iterate through all tickets and update their status
      for (let ticket of game.tickets) {
        // Skip tickets that are already in a final state (WIN or LOSE)
        if (ticket.status === 'WIN' || ticket.status === 'LOSE') {
          continue;
        }
  
        // Decide ticket status based on winning numbers
        const ticketStatus = await changeTicketStatus(ticket, game.winningNumbers);
        
        // Update ticket status
        ticket.status = ticketStatus.status;
      }
    }
    return game;
  }
  
   
  
  // Generate winning numbers for the game
  export async function generateWinningNumbers(
    game: KenoGameWithTickets
  ): Promise<KenoGameWithTickets> {

    const totalNumberToGenerate = kenoGameConstants.numberOfWinningNumbersToGenerate;
    const numberStartFrom = kenoGameConstants.startNumber;
    const numberEnd = kenoGameConstants.endNumber;
    const winningNumbers = generateUniqueRandomNumbers(totalNumberToGenerate, numberStartFrom, numberEnd);
    
    return db.kenoGame.update({
      where: { id: game.id },
      data: { winningNumbers, status: "ON_PLAY" },
      include: { tickets: { orderBy: { createdAt: "desc" } } },
    });
  }

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
  
  // Decide winning and losing tickets
  export async function changeTicketStatus(
    ticket: Ticket,
    winningNumbers: number[]
  ): Promise<Ticket> {
    const losingNumbers = ticket.numbers.filter(
      (ticketNumber) => !winningNumbers.includes(ticketNumber)
    );
    const isWin = losingNumbers.length === 0;
  
    return db.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: isWin ? "WIN" : "LOSE",
      },
    });
  }
  
  // Decide winning and losing tickets
  export function getTicketWinningStatus(
    ticket: Ticket,
    winningNumbers: number[]
  ): "WIN" | "LOSE" {
    const losingNumbers = ticket.numbers.filter(
      (ticketNumber) => !winningNumbers.includes(ticketNumber)
    );
    const isWin = losingNumbers.length === 0;
  
    return isWin ? "WIN" : "LOSE";
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
  
  //// Payout Managements
  
  /**
   * Calculates the payout multiplier based on the number of selected numbers.
   * @param {number} numberOfSelections - The number of selected numbers on the ticket.
   * @return {number} The payout multiplier.
   */
  function getPayoutMultiplier(numberOfSelections: number) {
    if (numberOfSelections < 2 || numberOfSelections > 10) {
      throw new Error(
        "Invalid number of selections. Only 2-10 selections are allowed."
      );
    }
  
  
    // Base payout multiplier
    const baseMultiplier = 150;
  
    // Decrease factor for each additional selection
    const decreasePerSelection = 5;
  
    // Calculate the decrease based on the number of selections (subtract 2 because 2 selections has no decrease)
    const totalDecrease = (numberOfSelections - 2) * decreasePerSelection;
  
    // Calculate final multiplier
    return baseMultiplier + totalDecrease; 
  }
   
  /**
   * Generates an array of objects mapping number of selections to payout multipliers.
   * @return {Array} Array containing objects with numberSelection and payoutMultiplier.
   */
  export function generateSelectionsPayouts() {
    const selectionsPayouts: ISelectionPayout[] = [];
  
    for (let i = 2; i <= 10; i++) {
      selectionsPayouts.push({
        numberSelection: i,
        payoutMultiplier: getPayoutMultiplier(i),
      });
    }
  
    return selectionsPayouts;
  }
  
  export const kenoPayoutMultiplier = generateSelectionsPayouts();
  
  // Calculate the time left until the game ends
  export function calculateTimeLeft(endAt: Date): number {
    const now = new Date();
    const timeLeft = Math.ceil((endAt.getTime() - now.getTime()) / 1000);
    return timeLeft > 0 ? timeLeft : 0; // Ensure the counter doesn't go negative
  }
  
  // Usage
  