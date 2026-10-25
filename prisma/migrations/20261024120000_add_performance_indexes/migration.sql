-- Doublons (même joueur tenté deux fois dans une partie) laissés par d'anciennes courses :
-- on garde la première tentative pour pouvoir poser la contrainte unique.
DELETE FROM "Attempt" a
USING "Attempt" b
WHERE a."dailyResultId" = b."dailyResultId"
  AND a."playerId" = b."playerId"
  AND a."attemptNumber" > b."attemptNumber";

-- CreateIndex
CREATE UNIQUE INDEX "Attempt_dailyResultId_playerId_key" ON "Attempt"("dailyResultId", "playerId");

-- CreateIndex
CREATE INDEX "Attempt_playerId_idx" ON "Attempt"("playerId");

-- CreateIndex
CREATE INDEX "DailyM8DLEResult_date_success_idx" ON "DailyM8DLEResult"("date", "success");

-- CreateIndex
CREATE INDEX "OrganizationPlayer_playerId_idx" ON "OrganizationPlayer"("playerId");

-- CreateIndex
CREATE INDEX "PlayerOtd_playerId_idx" ON "PlayerOtd"("playerId");
