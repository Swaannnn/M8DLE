import { prisma } from '@/lib/db'
import { getGameDate } from '@/utils/dateUtils'

const hashString = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

export async function getOrGeneratePlayerOfTheDay(date?: Date) {
    const gameDate = date ?? getGameDate()

    // 1. Cherche dans la base de données s'il existe déjà un Joueur du Jour pour cette date
    const existing = await prisma.playerOtd.findFirst({
        where: { date: gameDate },
        include: { player: true },
    })

    if (existing) {
        return existing.player
    }

    // 2. Sinon, tirage déterministe et enregistrement du PlayerOtd
    const allPlayers = await prisma.player.findMany({ orderBy: { id: 'asc' } })
    if (allPlayers.length === 0) return null

    const dayKey = gameDate.toISOString().slice(0, 10)
    const seed = hashString(dayKey)
    const random = seededRandom(seed)
    const index = Math.floor(random * allPlayers.length)
    const selectedPlayer = allPlayers[index]

    try {
        await prisma.playerOtd.create({
            data: {
                date: gameDate,
                playerId: selectedPlayer.id,
            },
        })
    } catch (e) {
        // En cas d'insertion simultanée
    }

    return selectedPlayer
}
