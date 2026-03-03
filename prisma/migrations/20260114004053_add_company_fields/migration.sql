-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "kybStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "siret" TEXT,
ADD COLUMN     "vatNumber" TEXT,
ADD COLUMN     "zipCode" TEXT;
