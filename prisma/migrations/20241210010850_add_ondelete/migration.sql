-- DropForeignKey
ALTER TABLE "Nominations" DROP CONSTRAINT "Nominations_nominationId_fkey";

-- DropForeignKey
ALTER TABLE "Nominees" DROP CONSTRAINT "Nominees_nomineeId_fkey";

-- AddForeignKey
ALTER TABLE "Nominations" ADD CONSTRAINT "Nominations_nominationId_fkey" FOREIGN KEY ("nominationId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nominees" ADD CONSTRAINT "Nominees_nomineeId_fkey" FOREIGN KEY ("nomineeId") REFERENCES "Nominations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
