-- CreateEnum
CREATE TYPE "ElectionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "TotalVotesCastRule" AS ENUM ('NOT_VALIDATED', 'MUST_EQUAL_VALID_PLUS_REJECTED', 'MUST_BE_GTE_VALID_PLUS_REJECTED');

-- CreateEnum
CREATE TYPE "PollingUnitStatus" AS ENUM ('PENDING_VERIFICATION', 'ACTIVE', 'MERGED', 'INVALID');

-- CreateEnum
CREATE TYPE "ImportEntityType" AS ENUM ('WARD', 'POLLING_UNIT');

-- CreateEnum
CREATE TYPE "ImportBatchStatus" AS ENUM ('PENDING', 'PREVIEWED', 'VALIDATION_FAILED', 'COMMITTED', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "ImportErrorType" AS ENUM ('MISSING_FIELD', 'INVALID_CODE', 'DUPLICATE', 'UNMATCHED_LGA', 'UNMATCHED_WARD', 'INVALID_HIERARCHY', 'OTHER');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "VerificationAction" AS ENUM ('APPROVE', 'REJECT', 'REQUEST_CORRECTION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AdminRoleName" ADD VALUE 'ELECTION_ADMIN';
ALTER TYPE "AdminRoleName" ADD VALUE 'ELECTION_SUPERVISOR';
ALTER TYPE "AdminRoleName" ADD VALUE 'ELECTION_COLLECTOR';

-- CreateTable
CREATE TABLE "State" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lga" (
    "id" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ward" (
    "id" TEXT NOT NULL,
    "lgaId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollingUnit" (
    "id" TEXT NOT NULL,
    "wardId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "puNumber" TEXT,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "status" "PollingUnitStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "sourceDocument" TEXT,
    "importBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PollingUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliticalParty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acronym" TEXT NOT NULL,
    "logoUrl" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PoliticalParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "electionType" TEXT NOT NULL,
    "electionDate" TIMESTAMP(3) NOT NULL,
    "status" "ElectionStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "requireAccreditedVoters" BOOLEAN NOT NULL DEFAULT true,
    "requireTotalVotesCast" BOOLEAN NOT NULL DEFAULT true,
    "totalVotesCastRule" "TotalVotesCastRule" NOT NULL DEFAULT 'MUST_EQUAL_VALID_PLUS_REJECTED',
    "publicationPolicy" TEXT,
    "allowWinnerProjection" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "runningMate" TEXT,
    "ballotOrder" INTEGER NOT NULL DEFAULT 0,
    "photoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectorAssignment" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "pollingUnitId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectorAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultSubmission" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "pollingUnitId" TEXT NOT NULL,
    "collectorId" TEXT NOT NULL,
    "status" "ResultStatus" NOT NULL DEFAULT 'DRAFT',
    "accreditedVoters" INTEGER,
    "totalVotesCast" INTEGER,
    "rejectedVotes" INTEGER NOT NULL DEFAULT 0,
    "validVotes" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "rejectionReason" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "supersedesId" TEXT,
    "isCurrentVersion" BOOLEAN NOT NULL DEFAULT true,
    "submittedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "publishedById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResultSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateVote" (
    "id" TEXT NOT NULL,
    "resultSubmissionId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "votes" INTEGER NOT NULL,

    CONSTRAINT "CandidateVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultDocument" (
    "id" TEXT NOT NULL,
    "resultSubmissionId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "fileSizeBytes" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationReview" (
    "id" TEXT NOT NULL,
    "resultSubmissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "action" "VerificationAction" NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportBatch" (
    "id" TEXT NOT NULL,
    "entityType" "ImportEntityType" NOT NULL,
    "sourceFilename" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "status" "ImportBatchStatus" NOT NULL DEFAULT 'PENDING',
    "columnMapping" JSONB NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "validRows" INTEGER NOT NULL DEFAULT 0,
    "invalidRows" INTEGER NOT NULL DEFAULT 0,
    "duplicateRows" INTEGER NOT NULL DEFAULT 0,
    "summary" JSONB,
    "committedAt" TIMESTAMP(3),
    "rolledBackAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportError" (
    "id" TEXT NOT NULL,
    "importBatchId" TEXT NOT NULL,
    "rowNumber" INTEGER NOT NULL,
    "rawData" JSONB NOT NULL,
    "errorType" "ImportErrorType" NOT NULL,
    "errorMessage" TEXT NOT NULL,

    CONSTRAINT "ImportError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationEvent" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeId" TEXT,
    "resultSubmissionIds" JSONB NOT NULL,
    "publishedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "State_code_key" ON "State"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Lga_code_key" ON "Lga"("code");

-- CreateIndex
CREATE INDEX "Lga_stateId_idx" ON "Lga"("stateId");

-- CreateIndex
CREATE UNIQUE INDEX "Lga_stateId_name_key" ON "Lga"("stateId", "name");

-- CreateIndex
CREATE INDEX "Ward_lgaId_idx" ON "Ward"("lgaId");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_lgaId_name_key" ON "Ward"("lgaId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PollingUnit_code_key" ON "PollingUnit"("code");

-- CreateIndex
CREATE INDEX "PollingUnit_wardId_idx" ON "PollingUnit"("wardId");

-- CreateIndex
CREATE INDEX "PollingUnit_status_idx" ON "PollingUnit"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PoliticalParty_name_key" ON "PoliticalParty"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PoliticalParty_acronym_key" ON "PoliticalParty"("acronym");

-- CreateIndex
CREATE INDEX "Election_status_idx" ON "Election"("status");

-- CreateIndex
CREATE INDEX "Candidate_electionId_idx" ON "Candidate"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_electionId_partyId_key" ON "Candidate"("electionId", "partyId");

-- CreateIndex
CREATE INDEX "CollectorAssignment_userId_idx" ON "CollectorAssignment"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CollectorAssignment_electionId_pollingUnitId_userId_key" ON "CollectorAssignment"("electionId", "pollingUnitId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ResultSubmission_supersedesId_key" ON "ResultSubmission"("supersedesId");

-- CreateIndex
CREATE INDEX "ResultSubmission_electionId_pollingUnitId_isCurrentVersion_idx" ON "ResultSubmission"("electionId", "pollingUnitId", "isCurrentVersion");

-- CreateIndex
CREATE INDEX "ResultSubmission_status_idx" ON "ResultSubmission"("status");

-- CreateIndex
CREATE INDEX "ResultSubmission_collectorId_idx" ON "ResultSubmission"("collectorId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateVote_resultSubmissionId_candidateId_key" ON "CandidateVote"("resultSubmissionId", "candidateId");

-- CreateIndex
CREATE INDEX "ResultDocument_resultSubmissionId_idx" ON "ResultDocument"("resultSubmissionId");

-- CreateIndex
CREATE INDEX "VerificationReview_resultSubmissionId_idx" ON "VerificationReview"("resultSubmissionId");

-- CreateIndex
CREATE INDEX "ImportBatch_status_idx" ON "ImportBatch"("status");

-- CreateIndex
CREATE INDEX "ImportError_importBatchId_idx" ON "ImportError"("importBatchId");

-- CreateIndex
CREATE INDEX "PublicationEvent_electionId_idx" ON "PublicationEvent"("electionId");

-- AddForeignKey
ALTER TABLE "Lga" ADD CONSTRAINT "Lga_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ward" ADD CONSTRAINT "Ward_lgaId_fkey" FOREIGN KEY ("lgaId") REFERENCES "Lga"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollingUnit" ADD CONSTRAINT "PollingUnit_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "Ward"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollingUnit" ADD CONSTRAINT "PollingUnit_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "PoliticalParty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorAssignment" ADD CONSTRAINT "CollectorAssignment_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorAssignment" ADD CONSTRAINT "CollectorAssignment_pollingUnitId_fkey" FOREIGN KEY ("pollingUnitId") REFERENCES "PollingUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorAssignment" ADD CONSTRAINT "CollectorAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectorAssignment" ADD CONSTRAINT "CollectorAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSubmission" ADD CONSTRAINT "ResultSubmission_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSubmission" ADD CONSTRAINT "ResultSubmission_pollingUnitId_fkey" FOREIGN KEY ("pollingUnitId") REFERENCES "PollingUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSubmission" ADD CONSTRAINT "ResultSubmission_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSubmission" ADD CONSTRAINT "ResultSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSubmission" ADD CONSTRAINT "ResultSubmission_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultSubmission" ADD CONSTRAINT "ResultSubmission_supersedesId_fkey" FOREIGN KEY ("supersedesId") REFERENCES "ResultSubmission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateVote" ADD CONSTRAINT "CandidateVote_resultSubmissionId_fkey" FOREIGN KEY ("resultSubmissionId") REFERENCES "ResultSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateVote" ADD CONSTRAINT "CandidateVote_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultDocument" ADD CONSTRAINT "ResultDocument_resultSubmissionId_fkey" FOREIGN KEY ("resultSubmissionId") REFERENCES "ResultSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultDocument" ADD CONSTRAINT "ResultDocument_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_resultSubmissionId_fkey" FOREIGN KEY ("resultSubmissionId") REFERENCES "ResultSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationReview" ADD CONSTRAINT "VerificationReview_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportError" ADD CONSTRAINT "ImportError_importBatchId_fkey" FOREIGN KEY ("importBatchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationEvent" ADD CONSTRAINT "PublicationEvent_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationEvent" ADD CONSTRAINT "PublicationEvent_publishedById_fkey" FOREIGN KEY ("publishedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
