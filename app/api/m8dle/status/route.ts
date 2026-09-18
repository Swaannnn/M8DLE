import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { findGameOwner } from '@/lib/auth/gameOwner'
import { getGameDate } from '@/utils/dateUtils'
import { getOrGeneratePlayerOfTheDay } from '@/utils/player/playerOfTheDay'
import { comparePlayer } from '@/utils/player/compare'
import { playerWithRelationsInclude } from '@/types/player'
import type { M8dleStatus } from '@/types/m8dleStatus'
import ApiErrorKey from '@/constants/apiErrorKeys'

const EMPTY_STATUS: M8dleStatus = { success: false, attempts: [], playerOfTheDay: null }

/** Avancement du jour pour le joueur en cours, connecté ou invité. */
export async function GET() {
    try {
        const owner = await findGameOwner()
        if (!owner) return NextResponse.json(EMPTY_STATUS)

        const gameDate = getGameDate()
        const dailyResult = await prisma.dailyM8DLEResult.findFirst({
            where: { ...owner, date: gameDate },
            select: {
                success: true,
                attempts: {
                    select: { playerId: true },
                    orderBy: { attemptNumber: 'asc' },
                },
            },
        })

        if (!dailyResult || dailyResult.attempts.length === 0) {
            return NextResponse.json(dailyResult ? { ...EMPTY_STATUS, success: dailyResult.success } : EMPTY_STATUS)
        }

        const playerOfTheDay = await getOrGeneratePlayerOfTheDay(gameDate)
        if (!playerOfTheDay) return NextResponse.json(EMPTY_STATUS)

        const attemptedIds = dailyResult.attempts.map((a) => a.playerId)
        const attemptedPlayers = await prisma.player.findMany({
            where: { id: { in: attemptedIds } },
            include: playerWithRelationsInclude,
        })
        const playersById = new Map(attemptedPlayers.map((player) => [player.id, player]))

        const status: M8dleStatus = {
            success: dailyResult.success,
            attempts: attemptedIds.flatMap((playerId) => {
                const player = playersById.get(playerId)
                return player ? [{ playerId, comparison: comparePlayer(player, playerOfTheDay) }] : []
            }),
            // La réponse n'est révélée qu'une fois la partie gagnée.
            playerOfTheDay: dailyResult.success ? playerOfTheDay : null,
        }

        return NextResponse.json(status)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}
