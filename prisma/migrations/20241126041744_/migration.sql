/*
  Warnings:

  - You are about to drop the column `nomineeName` on the `Nominees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nominationId]` on the table `Nominations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Nominees" DROP COLUMN "nomineeName",
ALTER COLUMN "uniqueNomineeId" DROP DEFAULT,
ALTER COLUMN "uniqueNomineeId" SET DATA TYPE TEXT;
DROP SEQUENCE "Nominees_uniqueNomineeId_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Nominations_nominationId_key" ON "Nominations"("nominationId");
