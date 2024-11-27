/*
  Warnings:

  - You are about to drop the column `nominationCategory` on the `Nominations` table. All the data in the column will be lost.
  - Added the required column `nominationDescription` to the `Nominations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nominationTitle` to the `Nominations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomineeAmount` to the `Nominees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomineeVotes` to the `Nominees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nominations" DROP COLUMN "nominationCategory",
ADD COLUMN     "nominationCategories" TEXT[],
ADD COLUMN     "nominationDescription" TEXT NOT NULL,
ADD COLUMN     "nominationTitle" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Nominees" ADD COLUMN     "nomineeAmount" INTEGER NOT NULL,
ADD COLUMN     "nomineeVotes" INTEGER NOT NULL;
