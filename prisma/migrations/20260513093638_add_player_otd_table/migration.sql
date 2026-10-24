-- CreateTable
CREATE TABLE "PlayerOtd" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "playerId" TEXT NOT NULL,

    CONSTRAINT "PlayerOtd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerOtd" ADD CONSTRAINT "PlayerOtd_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
