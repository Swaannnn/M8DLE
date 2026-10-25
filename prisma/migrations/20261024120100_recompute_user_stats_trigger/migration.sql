-- Les statistiques sont tenues à jour par incréments, et l'ancien trigger en manquait deux cas :
--   - une partie invité rattachée à un compte (userId passe de NULL à l'utilisateur) n'ajoutait
--     ni sa victoire ni ses tentatives, tout en comptant dans le dénominateur de la moyenne ;
--   - à la suppression en cascade d'une partie, les Attempt supprimées ne retrouvaient plus leur
--     partie et totalAttempts n'était pas décrémenté.
-- Les compteurs restent incrémentaux : les tentatives d'avant la table Attempt (colonne JSON
-- supprimée par 20260513092744_maj_structure) n'existent plus qu'à travers totalAttempts, un
-- recalcul depuis Attempt les effacerait. Aucune valeur existante n'est donc réécrite ici.

DROP TRIGGER IF EXISTS trigger_update_user_stats_daily_inc ON "DailyM8DLEResult";
DROP TRIGGER IF EXISTS trigger_update_user_stats_attempt_inc ON "Attempt";
DROP FUNCTION IF EXISTS update_user_stats_incremental();

-- Applique un écart aux compteurs d'un utilisateur puis recalcule sa moyenne.
CREATE OR REPLACE FUNCTION apply_user_stats_delta(target_user_id TEXT, wins_delta INT, attempts_delta INT)
RETURNS void AS $$
DECLARE
    v_games INT;
BEGIN
    SELECT COUNT(*) INTO v_games FROM "DailyM8DLEResult" WHERE "userId" = target_user_id;

    UPDATE "User"
    SET "totalWins" = "totalWins" + wins_delta,
        "totalAttempts" = "totalAttempts" + attempts_delta,
        "averageAttempts" = CASE
            WHEN v_games > 0 THEN ROUND(CAST("totalAttempts" + attempts_delta AS NUMERIC) / v_games, 2)
            ELSE 0
        END
    WHERE "id" = target_user_id;
END;
$$ LANGUAGE plpgsql;

-- Partie créée, gagnée ou rattachée à un compte. Ses tentatives suivent la partie lors d'un
-- changement de propriétaire.
CREATE OR REPLACE FUNCTION update_user_stats_on_result_change()
RETURNS TRIGGER AS $$
DECLARE
    v_attempts INT := 0;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW."userId" IS DISTINCT FROM OLD."userId" THEN
        SELECT COUNT(*) INTO v_attempts FROM "Attempt" WHERE "dailyResultId" = NEW."id";

        IF OLD."userId" IS NOT NULL THEN
            PERFORM apply_user_stats_delta(OLD."userId", -OLD."success"::INT, -v_attempts);
        END IF;
        IF NEW."userId" IS NOT NULL THEN
            PERFORM apply_user_stats_delta(NEW."userId", NEW."success"::INT, v_attempts);
        END IF;
    ELSIF NEW."userId" IS NOT NULL THEN
        -- INSERT (les tentatives arrivent ensuite par le trigger de Attempt) ou victoire.
        PERFORM apply_user_stats_delta(
            NEW."userId",
            NEW."success"::INT - CASE WHEN TG_OP = 'UPDATE' THEN OLD."success"::INT ELSE 0 END,
            0
        );
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Partie supprimée : en BEFORE, ses tentatives existent encore et peuvent être décomptées.
-- Celles supprimées ensuite par la cascade ne retrouvent plus leur partie et sont ignorées.
CREATE OR REPLACE FUNCTION update_user_stats_before_result_delete()
RETURNS TRIGGER AS $$
DECLARE
    v_attempts INT;
BEGIN
    IF OLD."userId" IS NOT NULL THEN
        SELECT COUNT(*) INTO v_attempts FROM "Attempt" WHERE "dailyResultId" = OLD."id";
        PERFORM apply_user_stats_delta(OLD."userId", -OLD."success"::INT, -v_attempts);
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- La moyenne dépend du nombre de parties : on la recalcule une fois la ligne partie.
CREATE OR REPLACE FUNCTION update_user_stats_after_result_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD."userId" IS NOT NULL THEN
        PERFORM apply_user_stats_delta(OLD."userId", 0, 0);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_stats_on_attempt_change()
RETURNS TRIGGER AS $$
DECLARE
    target_user_id TEXT;
BEGIN
    SELECT "userId" INTO target_user_id
    FROM "DailyM8DLEResult"
    WHERE "id" = COALESCE(NEW."dailyResultId", OLD."dailyResultId");

    IF target_user_id IS NOT NULL THEN
        PERFORM apply_user_stats_delta(target_user_id, 0, CASE WHEN TG_OP = 'INSERT' THEN 1 ELSE -1 END);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_stats_result_insert
AFTER INSERT ON "DailyM8DLEResult"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_result_change();

-- Seuls `success` et `userId` influent sur les statistiques.
CREATE TRIGGER trigger_user_stats_result_update
AFTER UPDATE OF "success", "userId" ON "DailyM8DLEResult"
FOR EACH ROW
WHEN (OLD."success" IS DISTINCT FROM NEW."success" OR OLD."userId" IS DISTINCT FROM NEW."userId")
EXECUTE FUNCTION update_user_stats_on_result_change();

CREATE TRIGGER trigger_user_stats_result_before_delete
BEFORE DELETE ON "DailyM8DLEResult"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_before_result_delete();

CREATE TRIGGER trigger_user_stats_result_after_delete
AFTER DELETE ON "DailyM8DLEResult"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_after_result_delete();

CREATE TRIGGER trigger_user_stats_attempt
AFTER INSERT OR DELETE ON "Attempt"
FOR EACH ROW
EXECUTE FUNCTION update_user_stats_on_attempt_change();
