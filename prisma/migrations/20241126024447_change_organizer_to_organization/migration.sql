/*
  Warnings:

  - You are about to drop the `Organizers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Organizers" DROP CONSTRAINT "Organizers_organizerId_fkey";

-- DropTable
DROP TABLE "Organizers";

-- CreateTable
CREATE TABLE "Organizations" (
    "id" SERIAL NOT NULL,
    "organizationName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otherPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "uniqueOrganizationId" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_id_key" ON "Organizations"("id");

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
