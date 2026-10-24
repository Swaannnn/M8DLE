-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "DailyM8DLEResult" DROP COLUMN "attempts";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "discriminator",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Attempt" (
    "id" TEXT NOT NULL,
    "attemptNumber" INTEGER NOT NULL,
    "dailyResultId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nationality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Nationality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationPlayer" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3),
    "playerId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "OrganizationPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "nationalityId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Attempt_dailyResultId_attemptNumber_key" ON "Attempt"("dailyResultId", "attemptNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Nationality_name_key" ON "Nationality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_name_key" ON "Organization"("name");

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_dailyResultId_fkey" FOREIGN KEY ("dailyResultId") REFERENCES "DailyM8DLEResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attempt" ADD CONSTRAINT "Attempt_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPlayer" ADD CONSTRAINT "OrganizationPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationPlayer" ADD CONSTRAINT "OrganizationPlayer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_nationalityId_fkey" FOREIGN KEY ("nationalityId") REFERENCES "Nationality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Suppression des anciennes fonctions et triggers
DROP TRIGGER IF EXISTS trigger_update_user_stats ON "DailyM8DLEResult";
DROP TRIGGER IF EXISTS trigger_update_user_stats_daily ON "DailyM8DLEResult";
DROP TRIGGER IF EXISTS trigger_update_user_stats_attempt ON "Attempt";
DROP FUNCTION IF EXISTS update_user_stats();

-- Création de la nouvelle fonction incrémentale
CREATE OR REPLACE FUNCTION update_user_stats_incremental()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id TEXT;
    current_total_attempts INT;
    current_total_games INT;
BEGIN
    -- GESTION DES VICTOIRES (Table DailyM8DLEResult)
    IF TG_TABLE_NAME = 'DailyM8DLEResult' THEN
        target_user_id := COALESCE(NEW."userId", OLD."userId");

        IF TG_OP = 'INSERT' THEN
            IF NEW.success = true THEN
                UPDATE "User" SET "totalWins" = "totalWins" + 1 WHERE id = target_user_id;
            END IF;

        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.success = false AND NEW.success = true THEN
                UPDATE "User" SET "totalWins" = "totalWins" + 1 WHERE id = target_user_id;
            ELSIF OLD.success = true AND NEW.success = false THEN
                UPDATE "User" SET "totalWins" = "totalWins" - 1 WHERE id = target_user_id;
            END IF;

        ELSIF TG_OP = 'DELETE' THEN
            IF OLD.success = true THEN
                UPDATE "User" SET "totalWins" = "totalWins" - 1 WHERE id = target_user_id;
            END IF;
        END IF;
        -- GESTION DES TENTATIVES (Table Attempt)
    ELSIF TG_TABLE_NAME = 'Attempt' THEN
        IF TG_OP = 'INSERT' THEN
            SELECT "userId" INTO target_user_id FROM "DailyM8DLEResult" WHERE id = NEW."dailyResultId";
            UPDATE "User" SET "totalAttempts" = "totalAttempts" + 1 WHERE id = target_user_id;

        ELSIF TG_OP = 'DELETE' THEN
            SELECT "userId" INTO target_user_id FROM "DailyM8DLEResult" WHERE id = OLD."dailyResultId";
            UPDATE "User" SET "totalAttempts" = "totalAttempts" - 1 WHERE id = target_user_id;
        END IF;
    END IF;

    -- GESTION DE LA MOYENNE (averageAttempts)
    IF target_user_id IS NOT NULL THEN
        SELECT "totalAttempts" INTO current_total_attempts FROM "User" WHERE id = target_user_id;
        SELECT COUNT(id) INTO current_total_games FROM "DailyM8DLEResult" WHERE "userId" = target_user_id;

        IF current_total_games > 0 THEN
            UPDATE "User" 
            SET "averageAttempts" = ROUND(CAST(current_total_attempts AS NUMERIC) / current_total_games, 2)
            WHERE id = target_user_id;
        ELSE
            UPDATE "User" SET "averageAttempts" = 0 WHERE id = target_user_id;
        END IF;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Ajout des nouveaux triggers sur les deux tables
CREATE TRIGGER trigger_update_user_stats_daily_inc
AFTER INSERT OR UPDATE OR DELETE ON "DailyM8DLEResult"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_incremental();

CREATE TRIGGER trigger_update_user_stats_attempt_inc
AFTER INSERT OR UPDATE OR DELETE ON "Attempt"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_incremental();
