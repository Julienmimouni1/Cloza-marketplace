-- CreateEnum
CREATE TYPE "KybDocumentType" AS ENUM ('KBIS', 'IDENTITY');

-- CreateEnum
CREATE TYPE "KybDocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "KybDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "KybDocumentType" NOT NULL,
    "status" "KybDocumentStatus" NOT NULL DEFAULT 'PENDING',
    "filePath" TEXT NOT NULL,
    "encryptionIv" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KybDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "KybDocument" ADD CONSTRAINT "KybDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
