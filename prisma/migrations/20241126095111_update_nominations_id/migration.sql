/*
  Warnings:

  - A unique constraint covering the columns `[uniqueNominationId]` on the table `Nominations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Nominees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nominations_uniqueNominationId_key" ON "Nominations"("uniqueNominationId");

-- CreateIndex
CREATE UNIQUE INDEX "Nominees_id_key" ON "Nominees"("id");
