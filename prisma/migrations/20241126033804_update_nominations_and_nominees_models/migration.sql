/*
  Warnings:

  - You are about to drop the `Contestants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Contestants" DROP CONSTRAINT "Contestants_contestantId_fkey";

-- AlterTable
ALTER TABLE "Organizations" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Contestants";

-- CreateTable
CREATE TABLE "Nominations" (
    "id" SERIAL NOT NULL,
    "nominationCategory" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nominationId" TEXT NOT NULL,
    "nominationPeriod" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nominations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nominees" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uniqueNomineeId" SERIAL NOT NULL,
    "nomineeName" TEXT NOT NULL,
    "nomineePhone" TEXT NOT NULL,
    "nomineeFirstName" TEXT NOT NULL,
    "nomineeLastName" TEXT NOT NULL,
    "nomineeEmail" TEXT NOT NULL,
    "nomineeProfileImage" TEXT NOT NULL,
    "nomineeCategory" TEXT NOT NULL,
    "nomineeBio" TEXT NOT NULL,
    "nomineeCode" TEXT NOT NULL,
    "nomineeId" SERIAL NOT NULL,

    CONSTRAINT "Nominees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nominations_id_key" ON "Nominations"("id");

-- AddForeignKey
ALTER TABLE "Nominees" ADD CONSTRAINT "Nominees_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
