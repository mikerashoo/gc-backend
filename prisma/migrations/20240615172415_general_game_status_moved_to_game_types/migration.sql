/*
  Warnings:

  - You are about to drop the column `winningNumberWillBeGeneratedAt` on the `DogRacingGame` table. All the data in the column will be lost.
  - You are about to drop the column `winningNumbers` on the `DogRacingGame` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DogRacingGame" DROP COLUMN "winningNumberWillBeGeneratedAt",
DROP COLUMN "winningNumbers",
ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "KenoGame" ADD COLUMN     "status" "GameStatus" NOT NULL DEFAULT 'NOT_STARTED';
