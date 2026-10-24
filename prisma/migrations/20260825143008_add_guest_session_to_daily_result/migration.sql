-- AlterTable
ALTER TABLE "DailyM8DLEResult" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DailyM8DLEResult_guestId_date_key" ON "DailyM8DLEResult"("guestId", "date");

