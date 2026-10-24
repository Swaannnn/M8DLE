-- DropForeignKey
ALTER TABLE "OrganizationPlayer" DROP CONSTRAINT "OrganizationPlayer_playerId_fkey";

-- AddForeignKey
ALTER TABLE "OrganizationPlayer" ADD CONSTRAINT "OrganizationPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
