-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "discriminator" TEXT NOT NULL,
    "avatar" TEXT,
    "email" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyM8DLEResult" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyM8DLEResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_discordId_key" ON "User"("discordId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyM8DLEResult_userId_date_key" ON "DailyM8DLEResult"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyM8DLEResult" ADD CONSTRAINT "DailyM8DLEResult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
