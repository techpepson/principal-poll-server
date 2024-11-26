/*
  Warnings:

  - The `nominationId` column on the `Nominations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Nominations" DROP COLUMN "nominationId",
ADD COLUMN     "nominationId" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Nominations_nominationId_key" ON "Nominations"("nominationId");

-- AddForeignKey
ALTER TABLE "Nominations" ADD CONSTRAINT "Nominations_nominationId_fkey" FOREIGN KEY ("nominationId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
