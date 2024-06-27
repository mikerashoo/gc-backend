/*
  Warnings:

  - You are about to drop the column `branchId` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `endAt` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `kenoGameId` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `startAt` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `uniqueId` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[gameId]` on the table `KenoGame` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `KenoGame` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uniqueId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('NOT_STARTED', 'ON_PLAY', 'DONE');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('KENO', 'DOG_RACING', 'HORSE_RASING');

-- DropForeignKey
ALTER TABLE "KenoGame" DROP CONSTRAINT "KenoGame_branchId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_gameId_fkey";

-- DropForeignKey
ALTER TABLE "TicketSelection" DROP CONSTRAINT "TicketSelection_ticketId_fkey";

-- AlterTable
ALTER TABLE "KenoGame" DROP COLUMN "branchId",
DROP COLUMN "createdAt",
DROP COLUMN "endAt",
DROP COLUMN "kenoGameId",
DROP COLUMN "startAt",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "gameId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "uniqueId",
ADD COLUMN     "uniqueId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "KenoGameStatus";

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "gameType" "GameType" NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogRacingGame" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "winningNumbers" INTEGER[],
    "ticketWillBeDisabledAt" TIMESTAMP(3) NOT NULL,
    "winningNumberWillBeGeneratedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DogRacingGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KenoTicket" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "KenoTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DogRacingTicket" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,

    CONSTRAINT "DogRacingTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DogRacingGame_gameId_key" ON "DogRacingGame"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "KenoTicket_ticketId_key" ON "KenoTicket"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "DogRacingTicket_ticketId_key" ON "DogRacingTicket"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "KenoGame_gameId_key" ON "KenoGame"("gameId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KenoGame" ADD CONSTRAINT "KenoGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogRacingGame" ADD CONSTRAINT "DogRacingGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KenoTicket" ADD CONSTRAINT "KenoTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DogRacingTicket" ADD CONSTRAINT "DogRacingTicket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketSelection" ADD CONSTRAINT "TicketSelection_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "KenoTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
