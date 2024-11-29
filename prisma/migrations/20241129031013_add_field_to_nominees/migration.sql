/*
  Warnings:

  - A unique constraint covering the columns `[uniqueNomineeId]` on the table `Nominees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uniqueOrganizationId]` on the table `Organizations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nomineeCategory` to the `Nominees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nominees" ADD COLUMN     "nomineeCategory" TEXT NOT NULL,
ADD COLUMN     "nomineeStatus" TEXT NOT NULL DEFAULT 'pending',
ALTER COLUMN "nomineeAmount" SET DEFAULT 0,
ALTER COLUMN "nomineeVotes" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Nominees_uniqueNomineeId_key" ON "Nominees"("uniqueNomineeId");

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_uniqueOrganizationId_key" ON "Organizations"("uniqueOrganizationId");
