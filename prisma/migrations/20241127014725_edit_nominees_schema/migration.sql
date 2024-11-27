/*
  Warnings:

  - You are about to drop the column `nomineeCategory` on the `Nominees` table. All the data in the column will be lost.
  - Added the required column `nominationRate` to the `Nominations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nominations" ADD COLUMN     "nominationRate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Nominees" DROP COLUMN "nomineeCategory";
