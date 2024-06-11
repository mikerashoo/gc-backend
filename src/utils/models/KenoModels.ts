import { KenoGame, Ticket, TicketSelection } from "@prisma/client";

export interface ITicketWithSelection extends Ticket {
    selections: TicketSelection[]
}


export interface ITicketWithGameAndSelection extends Ticket {
    selections: TicketSelection[],
    game: KenoGame
}

export interface IKenoGameWithTickets extends KenoGame {
    tickets: ITicketWithSelection[]; 
  };


export interface IKenoGameWithTicketsOptional extends KenoGame {
    tickets?: ITicketWithSelection[]; 
  };