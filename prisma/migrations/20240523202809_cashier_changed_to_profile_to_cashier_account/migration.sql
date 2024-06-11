/*
  Warnings:

  - You are about to drop the column `cashierId` on the `CashierAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `CashierAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `CashierAccount` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CashierAccount" DROP CONSTRAINT "CashierAccount_cashierId_fkey";

-- DropIndex
DROP INDEX "CashierAccount_cashierId_key";

-- AlterTable
ALTER TABLE "CashierAccount" DROP COLUMN "cashierId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CashierAccount_userId_key" ON "CashierAccount"("userId");

-- AddForeignKey
ALTER TABLE "CashierAccount" ADD CONSTRAINT "CashierAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
