-- AlterTable
ALTER TABLE "SubOrder" ADD COLUMN     "commissionRateApplied" INTEGER NOT NULL DEFAULT 1500;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "commissionRate" INTEGER;

-- CreateTable
CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "CommissionHistory" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT,
    "oldRate" INTEGER NOT NULL,
    "newRate" INTEGER NOT NULL,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommissionHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommissionHistory" ADD CONSTRAINT "CommissionHistory_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
