-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "billingInfo" JSONB,
ADD COLUMN     "shippingInfo" JSONB;

-- CreateTable
CREATE TABLE "CommissionException" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "rate" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommissionException_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayoutSettings" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "schedule" TEXT NOT NULL DEFAULT 'MONTHLY',
    "payoutsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "suspensionReason" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayoutSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommissionException_vendorId_category_key" ON "CommissionException"("vendorId", "category");

-- CreateIndex
CREATE UNIQUE INDEX "PayoutSettings_vendorId_key" ON "PayoutSettings"("vendorId");

-- AddForeignKey
ALTER TABLE "CommissionException" ADD CONSTRAINT "CommissionException_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayoutSettings" ADD CONSTRAINT "PayoutSettings_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
