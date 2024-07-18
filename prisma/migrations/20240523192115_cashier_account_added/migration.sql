/*
  Warnings:

  - You are about to drop the `_ShopToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_cashierId_fkey";

-- DropForeignKey
ALTER TABLE "_ShopToUser" DROP CONSTRAINT "_ShopToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShopToUser" DROP CONSTRAINT "_ShopToUser_B_fkey";

-- DropTable
DROP TABLE "_ShopToUser";

-- CreateTable
CREATE TABLE "Cashier" (
    "id" TEXT NOT NULL,
    "cashierId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "Cashier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketPayment" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "cashierId" TEXT NOT NULL,
    "paidAmount" DOUBLE PRECISION DEFAULT 0.0,
    "status" "TicketStatus" NOT NULL DEFAULT 'ON_PLAY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_id_key" ON "Cashier"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_cashierId_key" ON "Cashier"("cashierId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketPayment_ticketId_key" ON "TicketPayment"("ticketId");

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketPayment" ADD CONSTRAINT "TicketPayment_cashierId_fkey" FOREIGN KEY ("cashierId") REFERENCES "Cashier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
