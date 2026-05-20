/*
  Warnings:

  - You are about to drop the column `nationalityId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the `Nationality` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nationality` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_nationalityId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "nationalityId",
ADD COLUMN     "nationality" TEXT NOT NULL;

-- DropTable
DROP TABLE "Nationality";
