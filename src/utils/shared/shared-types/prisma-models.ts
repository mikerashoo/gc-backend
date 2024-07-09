// Auto-generated Prisma models

import { UserRole,ActiveStatus,ProviderUserRole,GameType,GameStatus,TicketStatus } from '@prisma/client';

export interface IDBUser {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  userName?: string;
  phoneNumber: string;
  role: UserRole;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  updatedAt: Date;
}

export interface IDBUserWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  userName?: string;
  phoneNumber: string;
  role: UserRole;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  updatedAt: Date;
  refreshTokens: IDBRefreshToken[];
}

export interface IDBCashier {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  phoneNumber: string;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  updatedAt: Date;
  branchId: string;
}

export interface IDBCashierWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  phoneNumber: string;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  updatedAt: Date;
  branchId: string;
  branch: IDBBranch;
  tickets: IDBTicket[];
  cancelledTickets: IDBTicket[];
  ticketPayments: IDBTicketPayment[];
  refreshTokens: IDBRefreshToken[];
}

export interface IDBProviderAdmin {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  phoneNumber: string;
  role: ProviderUserRole;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  updatedAt: Date;
  providerId: string;
}

export interface IDBProviderAdminWithRelations {
  id: string;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  phoneNumber: string;
  role: ProviderUserRole;
  status: ActiveStatus;
  createdAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  updatedAt: Date;
  providerId: string;
  provider: IDBProvider;
  refreshTokens: IDBRefreshToken[];
}

export interface IDBRefreshToken {
  id: string;
  hashedToken: string;
  userId?: string;
  cashierId?: string;
  providerAdminId?: string;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDBRefreshTokenWithRelations {
  id: string;
  hashedToken: string;
  userId?: string;
  User?: IDBUser;
  cashierId?: string;
  Cashier?: IDBCashier;
  providerAdminId?: string;
  providerAdmin?: IDBProviderAdmin;
  revoked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDBProvider {
  id: string;
  name: string;
  identifier: string;
  address: string;
  status: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface IDBProviderWithRelations {
  id: string;
  name: string;
  identifier: string;
  address: string;
  status: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  admins: IDBProviderAdmin[];
  branches: IDBBranch[];
}

export interface IDBBranch {
  id: string;
  identifier: string;
  name: string;
  address: string;
  providerId: string;
  status: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
}

export interface IDBBranchWithRelations {
  id: string;
  identifier: string;
  name: string;
  address: string;
  providerId: string;
  status: ActiveStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  deleted: boolean;
  provider: IDBProvider;
  cashiers: IDBCashier[];
  games: IDBGame[];
}

export interface IDBGame {
  id: string;
  uniqueId: string;
  branchId: string;
  gameType: GameType;
  startAt: Date;
  endAt: Date;
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDBGameWithRelations {
  id: string;
  uniqueId: string;
  branchId: string;
  gameType: GameType;
  startAt: Date;
  endAt: Date;
  status: GameStatus;
  createdAt: Date;
  updatedAt: Date;
  branch: IDBBranch;
  tickets: IDBTicket[];
  keno?: IDBKenoGame;
  dogRacing?: IDBDogRacingGame;
}

export interface IDBTicket {
  id: string;
  uniqueId: string;
  totalBetAmount?: number;
  possibleWinAmount?: number;
  winAmount?: number;
  status: TicketStatus;
  createdAt: Date;
  gameId: string;
  cashierId: string;
  cancelledAt?: Date;
  cancelledCashierId?: string;
}

export interface IDBTicketWithRelations {
  id: string;
  uniqueId: string;
  totalBetAmount?: number;
  possibleWinAmount?: number;
  winAmount?: number;
  status: TicketStatus;
  createdAt: Date;
  gameId: string;
  game: IDBGame;
  cashierId: string;
  cashier: IDBCashier;
  cancelledAt?: Date;
  cancelledCashierId?: string;
  cancelledBy?: IDBCashier;
  kenoTicket?: IDBKenoTicket;
  dogRacingTicket?: IDBDogRacingTicket;
  payment?: IDBTicketPayment;
}

export interface IDBKenoGame {
  id: string;
  gameId: string;
  winningNumbers: number[];
  ticketWillBeDisabledAt: Date;
  winningNumberWillBeShowedAt: Date;
}

export interface IDBKenoGameWithRelations {
  id: string;
  gameId: string;
  winningNumbers: number[];
  ticketWillBeDisabledAt: Date;
  winningNumberWillBeShowedAt: Date;
  game: IDBGame;
}

export interface IDBDogRacingGame {
  id: string;
  gameId: string;
  ticketWillBeDisabledAt: Date;
}

export interface IDBDogRacingGameWithRelations {
  id: string;
  gameId: string;
  ticketWillBeDisabledAt: Date;
  game: IDBGame;
}

export interface IDBKenoTicket {
  id: string;
  ticketId: string;
}

export interface IDBKenoTicketWithRelations {
  id: string;
  ticketId: string;
  selections: IDBTicketSelection[];
  ticket: IDBTicket;
}

export interface IDBDogRacingTicket {
  id: string;
  ticketId: string;
  //: Add;
}

export interface IDBDogRacingTicketWithRelations {
  id: string;
  ticketId: string;
  //: Add;
  ticket: IDBTicket;
}

export interface IDBTicketSelection {
  id: string;
  ticketId: string;
  selectedNumbers: number[];
  betAmount: number;
  possibleWinAmount?: number;
  winAmount?: number;
  status: TicketStatus;
}

export interface IDBTicketSelectionWithRelations {
  id: string;
  ticketId: string;
  selectedNumbers: number[];
  betAmount: number;
  possibleWinAmount?: number;
  winAmount?: number;
  status: TicketStatus;
  ticket: IDBKenoTicket;
}

export interface IDBTicketPayment {
  id: string;
  ticketId: string;
  cashierId: string;
  paidAmount?: number;
  createdAt: Date;
}

export interface IDBTicketPaymentWithRelations {
  id: string;
  ticketId: string;
  cashierId: string;
  paidAmount?: number;
  createdAt: Date;
  ticket: IDBTicket;
  cashier: IDBCashier;
}

