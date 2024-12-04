/*
  Warnings:

  - A unique constraint covering the columns `[nomineeCode]` on the table `Nominees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Nominees" ADD COLUMN     "tempAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tempVotes" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Nominees_nomineeCode_key" ON "Nominees"("nomineeCode");
