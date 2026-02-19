/*
  Warnings:

  - The `attempts` column on the `DailyM8DLEResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DailyM8DLEResult" DROP COLUMN "attempts",
ADD COLUMN     "attempts" JSONB NOT NULL DEFAULT '[]',
ALTER COLUMN "success" SET DEFAULT false;
