/*
  Warnings:

  - You are about to drop the `_BranchToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "_BranchToUser" DROP CONSTRAINT "_BranchToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BranchToUser" DROP CONSTRAINT "_BranchToUser_B_fkey";

-- DropTable
DROP TABLE "_BranchToUser";

-- CreateTable
CREATE TABLE "CashierAccount" (
    "id" TEXT NOT NULL,
    "cashierId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "CashierAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketPayment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "cashierId" TEXT NOT NULL,
    "payedAmount" DOUBLE PRECISION DEFAULT 0.0,
    "status" "TicketStatus" NOT NULL DEFAULT 'ON_PLAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CashierAccount_id_key" ON "CashierAccount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "CashierAccount_cashierId_key" ON "CashierAccount"("cashierId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketPayment_ticketId_key" ON "TicketPayment"("ticketId");

-- AddForeignKey
ALTER TABLE "CashierAccount" ADD CONSTRAINT "CashierAccount_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CashierAccount" ADD CONSTRAINT "CashierAccount_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "CashierAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "CashierAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
