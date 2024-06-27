/*
  Warnings:

  - You are about to drop the column `cashierId` on the `Cashier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cashier` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Cashier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cashier" DROP CONSTRAINT "Cashier_cashierId_fkey";

-- DropIndex
DROP INDEX "Cashier_cashierId_key";

-- AlterTable
ALTER TABLE "Cashier" DROP COLUMN "cashierId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cashier_userId_key" ON "Cashier"("userId");

-- AddForeignKey
ALTER TABLE "Cashier" ADD CONSTRAINT "Cashier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
