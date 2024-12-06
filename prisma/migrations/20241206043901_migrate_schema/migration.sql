/*
  Warnings:

  - A unique constraint covering the columns `[recipientCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[transferCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "transferCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_recipientCode_key" ON "User"("recipientCode");

-- CreateIndex
CREATE UNIQUE INDEX "User_transferCode_key" ON "User"("transferCode");
