/*
  Warnings:

  - You are about to drop the `Cashier` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "TicketSelectionStatus" ADD VALUE 'PAID';

-- DropForeignKey
ALTER TABLE "Cashier" DROP CONSTRAINT "Cashier_shopId_fkey";

-- DropForeignKey
ALTER TABLE "Cashier" DROP CONSTRAINT "Cashier_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_cancelledCashierId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "TicketPayment" DROP CONSTRAINT "TicketPayment_cashierId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "cashierId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- DropTable
DROP TABLE "Cashier";

-- CreateTable
CREATE TABLE "Cashier" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "userName" TEXT,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_id_key" ON "Cashier"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_userName_key" ON "Cashier"("userName");

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_cancelledCashierId_fkey" FOREIGN KEY ("cancelledCashierId") REFERENCES "Cashier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
