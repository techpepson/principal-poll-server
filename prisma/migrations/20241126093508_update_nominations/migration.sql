/*
  Warnings:

  - Added the required column `uniqueNominationId` to the `Nominations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nominations" ADD COLUMN     "uniqueNominationId" TEXT NOT NULL;
