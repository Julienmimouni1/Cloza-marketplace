-- AlterTable
ALTER TABLE "SubOrder" ADD COLUMN     "carrier" TEXT,
ADD COLUMN     "estimatedDelivery" TIMESTAMP(3),
ADD COLUMN     "trackingNumber" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "creditLimit" INTEGER NOT NULL DEFAULT 500000,
ADD COLUMN     "outstandingBalance" INTEGER NOT NULL DEFAULT 0;
