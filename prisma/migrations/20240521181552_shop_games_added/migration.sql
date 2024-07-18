-- CreateTable
CREATE TABLE "ShopGame" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShopGame_pkey" PRIMARY KEY ("id")
);
