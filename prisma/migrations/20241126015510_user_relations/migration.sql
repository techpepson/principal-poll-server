-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('ADMIN', 'SUPERADMIN', 'GUEST', 'REGULAR');

-- AlterTable
ALTER TABLE "Contestants" ADD COLUMN     "contestantId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "Organizers" ADD COLUMN     "organizerId" SERIAL NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'REGULAR';

-- AddForeignKey
ALTER TABLE "Organizers" ADD CONSTRAINT "Organizers_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contestants" ADD CONSTRAINT "Contestants_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
