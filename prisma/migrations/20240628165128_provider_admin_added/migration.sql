/*
  Warnings:

  - You are about to drop the column `fullName` on the `Cashier` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ProviderToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `firstName` to the `Cashier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Cashier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProviderUserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN');

-- DropForeignKey
ALTER TABLE "_ProviderToUser" DROP CONSTRAINT "_ProviderToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProviderToUser" DROP CONSTRAINT "_ProviderToUser_B_fkey";

-- AlterTable
ALTER TABLE "Cashier" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RefreshToken" ADD COLUMN     "providerAdminId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "fullName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProviderToUser";

-- CreateTable
CREATE TABLE "ProviderAdmin" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ProviderUserRole" NOT NULL DEFAULT 'SUPER_ADMIN',
    "status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "provideId" TEXT NOT NULL,

    CONSTRAINT "ProviderAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderAdmin_id_key" ON "ProviderAdmin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderAdmin_userName_key" ON "ProviderAdmin"("userName");

-- AddForeignKey
ALTER TABLE "ProviderAdmin" ADD CONSTRAINT "ProviderAdmin_provideId_fkey" FOREIGN KEY ("provideId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_providerAdminId_fkey" FOREIGN KEY ("providerAdminId") REFERENCES "ProviderAdmin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
