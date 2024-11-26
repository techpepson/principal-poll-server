/*
  Warnings:

  - Added the required column `nominationEndDate` to the `Nominations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nominationStartDate` to the `Nominations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nominations" ADD COLUMN     "nominationEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nominationStartDate" TIMESTAMP(3) NOT NULL;
