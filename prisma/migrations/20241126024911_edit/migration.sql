/*
  Warnings:

  - You are about to drop the column `organizerId` on the `Organizations` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `Organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organizations" DROP CONSTRAINT "Organizations_organizerId_fkey";

-- AlterTable
ALTER TABLE "Organizations" DROP COLUMN "organizerId",
ADD COLUMN     "organizationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
