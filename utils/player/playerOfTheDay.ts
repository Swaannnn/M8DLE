import 'server-only'

import { randomInt } from 'node:crypto'
import { prisma } from '@/lib/db'
import { getGameDate } from '@/utils/dateUtils'
import { playerWithRelationsInclude, type Player } from '@/types/player'

/** Nombre de jours pendant lesquels un joueur déjà tiré n'est pas réélligible. */
const SELECTION_COOLDOWN_DAYS = 7

/**
 * Renvoie le joueur du jour, en le tirant au sort la première fois qu'il est demandé.
 * Le tirage écarte les joueurs sortis récemment, puis choisit au hasard parmi le reste.
 * Il n'est volontairement pas reproductible : la réponse n'existe qu'en base.
 */
export async function getOrGeneratePlayerOfTheDay(date?: Date): Promise<Player | null> {
    const gameDate = date ?? getGameDate()

    const existing = await prisma.playerOtd.findUnique({
        where: { date: gameDate },
        include: { player: { include: playerWithRelationsInclude } },
    })

    if (existing) return existing.player

    const selected = await pickPlayer(gameDate)
    if (!selected) return null

    // `date` est unique : en cas de tirages concurrents, l'upsert renvoie de façon atomique
    // le gagnant, le nôtre ou celui d'une requête qui nous a devancés.
    const playerOtd = await prisma.playerOtd.upsert({
        where: { date: gameDate },
        create: { date: gameDate, playerId: selected.id },
        update: {},
        include: { player: { include: playerWithRelationsInclude } },
    })

    return playerOtd.player
}

/** Tire un joueur parmi ceux non sortis durant le cooldown, sinon parmi tous. */
async function pickPlayer(gameDate: Date): Promise<{ id: string } | null> {
    const cooldownStart = new Date(gameDate)
    cooldownStart.setDate(cooldownStart.getDate() - SELECTION_COOLDOWN_DAYS)

    const eligible = await prisma.player.findMany({
        where: { playerOtds: { none: { date: { gte: cooldownStart } } } },
        select: { id: true },
    })

    // Repli quand le catalogue est trop petit pour respecter le cooldown.
    const pool = eligible.length > 0 ? eligible : await prisma.player.findMany({ select: { id: true } })

    return pool.length > 0 ? pool[randomInt(pool.length)] : null
}
