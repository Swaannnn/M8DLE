-- AlterTable
ALTER TABLE "User" ADD COLUMN     "averageAttempts" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWins" INTEGER NOT NULL DEFAULT 0;

UPDATE "User"
SET 
  "totalWins" = (
    SELECT COUNT(*) FROM "DailyM8DLEResult" 
    WHERE "DailyM8DLEResult"."userId" = "User".id AND "success" = true
  ),
  "totalAttempts" = (
    SELECT COALESCE(SUM(jsonb_array_length("attempts")), 0) 
    FROM "DailyM8DLEResult" 
    WHERE "DailyM8DLEResult"."userId" = "User".id
  ),
  "averageAttempts" = (
    SELECT CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND(
          CAST(SUM(jsonb_array_length("attempts")) AS NUMERIC) / COUNT(*), 
          2
        )
      ELSE 0 
    END
    FROM "DailyM8DLEResult" 
    WHERE "DailyM8DLEResult"."userId" = "User".id
  );

-- Fonction + Trigger pour mettre à jour les statistiques des joueurs
-- automatiquement à chaque modification dans DailyResult
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "User"
    SET 
      "totalWins" = (
        SELECT COUNT(*) FROM "DailyM8DLEResult" 
        WHERE "userId" = COALESCE(NEW."userId", OLD."userId") AND "success" = true
      ),
      "totalAttempts" = (
        SELECT COALESCE(SUM(jsonb_array_length("attempts")), 0) 
        FROM "DailyM8DLEResult" 
        WHERE "userId" = COALESCE(NEW."userId", OLD."userId")
      ),
      "averageAttempts" = (
        SELECT CASE 
          WHEN COUNT(*) > 0 THEN 
            ROUND(CAST(SUM(jsonb_array_length("attempts")) AS NUMERIC) / COUNT(*), 2)
          ELSE 0 
        END
        FROM "DailyM8DLEResult" 
        WHERE "userId" = COALESCE(NEW."userId", OLD."userId")
      )
    WHERE id = COALESCE(NEW."userId", OLD."userId");
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats
AFTER INSERT OR UPDATE OR DELETE ON "DailyM8DLEResult"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats();