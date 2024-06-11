/*
  Warnings:

  - You are about to drop the column `numbers` on the `TicketSelection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TicketSelection" DROP COLUMN "numbers",
ADD COLUMN     "selectedNumbers" INTEGER[];
