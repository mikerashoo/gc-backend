-- CreateTable
CREATE TABLE "BranchGame" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BranchGame_pkey" PRIMARY KEY ("id")
);
