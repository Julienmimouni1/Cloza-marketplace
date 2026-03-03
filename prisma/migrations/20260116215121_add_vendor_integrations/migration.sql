-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('SHOPIFY', 'WOOCOMMERCE', 'GENERIC_CSV');

-- CreateTable
CREATE TABLE "ExternalIntegration" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "config" JSONB NOT NULL,
    "lastSync" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalIntegration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExternalIntegration" ADD CONSTRAINT "ExternalIntegration_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
