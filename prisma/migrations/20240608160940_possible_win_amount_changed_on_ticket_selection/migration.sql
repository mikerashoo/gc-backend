/*
  Warnings:

  - You are about to drop the column `possibleAmount` on the `TicketSelection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TicketSelection" DROP COLUMN "possibleAmount",
ADD COLUMN     "possibleWinAmount" DOUBLE PRECISION;
