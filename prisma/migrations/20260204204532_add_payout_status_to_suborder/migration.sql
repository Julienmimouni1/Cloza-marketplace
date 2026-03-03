-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID');

-- AlterTable
ALTER TABLE "SubOrder" ADD COLUMN     "payoutDate" TIMESTAMP(3),
ADD COLUMN     "payoutStatus" "PayoutStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "SubOrder_payoutStatus_idx" ON "SubOrder"("payoutStatus");
