/*
  Warnings:

  - You are about to drop the column `winningNumberWillBeGeneratedAt` on the `KenoGame` table. All the data in the column will be lost.
  - Added the required column `winningNumberWillBeShowedAt` to the `KenoGame` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TicketStatus" ADD VALUE 'CANCELLED';

-- AlterTable
ALTER TABLE "KenoGame" DROP COLUMN "winningNumberWillBeGeneratedAt",
ADD COLUMN     "winningNumberWillBeShowedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledCashierId" TEXT;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_cancelledCashierId_fkey" FOREIGN KEY ("cancelledCashierId") REFERENCES "Cashier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
