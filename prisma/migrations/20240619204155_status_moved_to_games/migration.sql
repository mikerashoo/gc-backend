/*
  Warnings:

  - You are about to drop the column `status` on the `DogRacingGame` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `KenoGame` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TicketPayment` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `TicketSelection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DogRacingGame" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "KenoGame" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "TicketPayment" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "TicketSelection" DROP COLUMN "status";
