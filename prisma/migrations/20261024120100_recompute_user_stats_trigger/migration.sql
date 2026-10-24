-- Les statistiques étaient tenues à jour par incréments, ce qui en manquait deux cas :
--   - une partie invité rattachée à un compte (userId passe de NULL à l'utilisateur) n'ajoutait
--     ni sa victoire ni ses tentatives, tout en comptant dans le dénominateur de la moyenne ;
--   - à la suppression en cascade d'une partie, les Attempt supprimées ne retrouvaient plus leur
--     partie et totalAttempts n'était pas décrémenté.
-- Elles sont désormais recalculées pour l'utilisateur concerné à chaque changement, ce qui reste
-- juste quel que soit le chemin d'écriture.

DROP TRIGGER IF EXISTS trigger_update_user_stats_daily_inc ON "DailyM8DLEResult";
DROP TRIGGER IF EXISTS trigger_update_user_stats_attempt_inc ON "Attempt";
DROP FUNCTION IF EXISTS update_user_stats_incremental();

CREATE OR REPLACE FUNCTION refresh_user_stats(target_user_id TEXT)
RETURNS void AS $$
DECLARE
    v_games INT;
    v_wins INT;
    v_attempts INT;
BEGIN
    SELECT COUNT(*), COUNT(*) FILTER (WHERE "success")
    INTO v_games, v_wins
    FROM "DailyM8DLEResult"
    WHERE "userId" = target_user_id;

    SELECT COUNT(*)
    INTO v_attempts
    FROM "Attempt" a
    JOIN "DailyM8DLEResult" r ON r."id" = a."dailyResultId"
    WHERE r."userId" = target_user_id;

    UPDATE "User"
    SET "totalWins" = v_wins,
        "totalAttempts" = v_attempts,
        "averageAttempts" = CASE
            WHEN v_games > 0 THEN ROUND(CAST(v_attempts AS NUMERIC) / v_games, 2)
            ELSE 0
        END
    WHERE "id" = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Partie créée, supprimée, gagnée ou rattachée à un compte : on recalcule l'ancien et le nouveau
-- propriétaire (identiques hors rattachement).
CREATE OR REPLACE FUNCTION refresh_user_stats_on_result_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP <> 'INSERT' AND OLD."userId" IS NOT NULL THEN
        PERFORM refresh_user_stats(OLD."userId");
    END IF;

    IF TG_OP <> 'DELETE' AND NEW."userId" IS NOT NULL
        AND (TG_OP = 'INSERT' OR NEW."userId" IS DISTINCT FROM OLD."userId") THEN
        PERFORM refresh_user_stats(NEW."userId");
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Tentative ajoutée ou supprimée. Lors d'une suppression en cascade la partie n'existe plus :
-- c'est alors le trigger de DailyM8DLEResult qui recalcule.
CREATE OR REPLACE FUNCTION refresh_user_stats_on_attempt_change()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id TEXT;
BEGIN
    SELECT "userId" INTO target_user_id
    FROM "DailyM8DLEResult"
    WHERE "id" = COALESCE(NEW."dailyResultId", OLD."dailyResultId");

    IF target_user_id IS NOT NULL THEN
        PERFORM refresh_user_stats(target_user_id);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_user_stats_result_insert_delete
AFTER INSERT OR DELETE ON "DailyM8DLEResult"
FOR EACH ROW
EXECUTE FUNCTION refresh_user_stats_on_result_change();

-- Seuls `success` et `userId` influent sur les statistiques.
CREATE TRIGGER trigger_refresh_user_stats_result_update
AFTER UPDATE OF "success", "userId" ON "DailyM8DLEResult"
FOR EACH ROW
WHEN (OLD."success" IS DISTINCT FROM NEW."success" OR OLD."userId" IS DISTINCT FROM NEW."userId")
EXECUTE FUNCTION refresh_user_stats_on_result_change();

CREATE TRIGGER trigger_refresh_user_stats_attempt
AFTER INSERT OR DELETE ON "Attempt"
FOR EACH ROW
EXECUTE FUNCTION refresh_user_stats_on_attempt_change();

-- Corrige les statistiques déjà faussées par l'ancien trigger.
SELECT refresh_user_stats("id") FROM "User";
