/*
  Warnings:

  - The values [BRANCH_ADMIN,CASHIER] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `providerAdminId` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the `ProviderAdmin` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AgentRule" AS ENUM ('SUPER_AGENT', 'AGENT');

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('ADMIN', 'PROVIDER_SUPER_ADMIN', 'PROVIDER_ADMIN', 'SUPER_AGENT', 'AGENT');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ProviderAdmin" DROP CONSTRAINT "ProviderAdmin_providerId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_providerAdminId_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phoneNumber_key";

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "agentId" TEXT;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "providerAdminId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "agentProviderId" TEXT,
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "superAgentId" TEXT;

-- DropTable
DROP TABLE "ProviderAdmin";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_superAgentId_fkey" FOREIGN KEY ("superAgentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_agentProviderId_fkey" FOREIGN KEY ("agentProviderId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
