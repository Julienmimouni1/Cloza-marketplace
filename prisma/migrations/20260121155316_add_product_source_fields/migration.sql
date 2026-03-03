-- CreateEnum
CREATE TYPE "ProductSource" AS ENUM ('MANUAL', 'CSV', 'SHOPIFY', 'WOOCOMMERCE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "source" "ProductSource" NOT NULL DEFAULT 'MANUAL';
