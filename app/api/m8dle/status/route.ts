import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { findGameOwner } from '@/lib/auth/gameOwner'
import { getGameDate } from '@/utils/dateUtils'
import { getPlayerOfTheDay } from '@/utils/player/playerOfTheDay'
import { getCatalogueWith } from '@/utils/player/catalogue'
import { comparePlayer } from '@/utils/player/compare'
import type { M8dleStatus } from '@/types/m8dleStatus'
import ApiErrorKey from '@/constants/apiErrorKeys'

const EMPTY_STATUS: M8dleStatus = { success: false, attempts: [], playerOfTheDay: null }

/** Avancement du jour pour le joueur en cours, connecté ou invité. */
export async function GET() {
    try {
        const owner = await findGameOwner()
        if (!owner) return NextResponse.json(EMPTY_STATUS)

        const gameDate = getGameDate()
        const dailyResultWhere = { ...owner, date: gameDate }

        const [dailyResult, attempts] = await Promise.all([
            prisma.dailyM8DLEResult.findFirst({
                where: dailyResultWhere,
                select: { success: true },
            }),
            prisma.attempt.findMany({
                where: { dailyResult: dailyResultWhere },
                select: { playerId: true },
                orderBy: { attemptNumber: 'asc' },
            }),
        ])

        if (!dailyResult || attempts.length === 0) {
            return NextResponse.json(dailyResult ? { ...EMPTY_STATUS, success: dailyResult.success } : EMPTY_STATUS)
        }

        const attemptedIds = attempts.map((a) => a.playerId)
        const [playerOfTheDay, playersById] = await Promise.all([
            getPlayerOfTheDay(gameDate),
            getCatalogueWith(attemptedIds),
        ])
        if (!playerOfTheDay) return NextResponse.json(EMPTY_STATUS)

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
