-- CreateEnum
CREATE TYPE "PayoutDetailsStage" AS ENUM ('AT_APPLICATION', 'AFTER_ACCEPTANCE');

-- CreateEnum
CREATE TYPE "NameMatch" AS ENUM ('UNVERIFIED', 'MATCH', 'PARTIAL', 'MISMATCH', 'FAILED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "announcementId" TEXT;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "payoutDetailsStage" "PayoutDetailsStage" NOT NULL DEFAULT 'AFTER_ACCEPTANCE',
ADD COLUMN     "requiresPayoutDetails" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "createdById" TEXT,
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationPayoutDetails" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "bankCode" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumberEnc" TEXT NOT NULL,
    "accountNumberLast4" TEXT NOT NULL,
    "accountNumberHash" TEXT NOT NULL,
    "verifiedName" TEXT,
    "nameMatch" "NameMatch" NOT NULL DEFAULT 'UNVERIFIED',
    "consentVersion" TEXT NOT NULL,
    "consentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationPayoutDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Announcement_createdAt_idx" ON "Announcement"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationPayoutDetails_applicationId_key" ON "ApplicationPayoutDetails"("applicationId");

-- CreateIndex
CREATE INDEX "ApplicationPayoutDetails_accountNumberHash_idx" ON "ApplicationPayoutDetails"("accountNumberHash");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_announcementId_fkey" FOREIGN KEY ("announcementId") REFERENCES "Announcement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationPayoutDetails" ADD CONSTRAINT "ApplicationPayoutDetails_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "ProgramApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

