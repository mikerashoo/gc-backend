/*
  Warnings:

  - You are about to drop the column `betAmount` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `numbers` on the `Ticket` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TicketSelectionStatus" AS ENUM ('ON_PLAY', 'WIN', 'LOSE');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "betAmount",
DROP COLUMN "numbers",
ADD COLUMN     "possibleWinAmount" DOUBLE PRECISION,
ADD COLUMN     "totalBetAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "TicketSelection" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "numbers" INTEGER[],
    "betAmount" DOUBLE PRECISION NOT NULL,
    "winAmount" DOUBLE PRECISION,
    "status" "TicketSelectionStatus" NOT NULL DEFAULT 'ON_PLAY',

    CONSTRAINT "TicketSelection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketSelection" ADD CONSTRAINT "TicketSelection_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
