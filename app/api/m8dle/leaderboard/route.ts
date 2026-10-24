import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { LeaderboardUser } from '@/types/leaderboard'
import { getNumberParamFromRequest } from '@/utils/requestUtils'
import constantsParams from '@/constants/constantsParams'
import ApiErrorKey from '@/constants/apiErrorKeys'
import { computeWinstreaks } from '@/utils/winstreakUtils'

/**
 * Récupère la liste des utiliateurs dans le BDD.
 * Traite les informations de la liste pour en faire
 * une liste de profile utilisateur pour le leaderboard.
 * Les informations traîtées dans cette fonction seront
 * le nombre total d'essai, la moyenne d'essai et pour
 * finir, le trie des profiles du leaderboard.
 *
 * @returns Liste de profile utilisateur
 */
export async function GET(request: NextRequest) {
    try {
        let page = getNumberParamFromRequest(request, 'page', 1)
        if (page < 1) page = 1

        const [total, rawUsers] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                select: {
                    id: true,
                    username: true,
                    discordId: true,
                    avatar: true,
                    totalWins: true,
                    totalAttempts: true,
                    averageAttempts: true,
                },
                orderBy: [
                    {
                        totalWins: 'desc',
                    },
                    {
                        averageAttempts: 'asc',
                    },
                ],
                skip: constantsParams.LEADERBOARD_PAGE_SIZE * (page - 1),
                take: constantsParams.LEADERBOARD_PAGE_SIZE,
            }),
        ])

        const winstreaks = await computeWinstreaks(rawUsers.map((user) => user.id))

        const users: LeaderboardUser[] = rawUsers.map((user) => ({
            id: user.id,
            username: user.username,
            discordId: user.discordId,
            avatar: user.avatar ?? '',
            wins: user.totalWins,
            averageAttempts: user.averageAttempts,
            winstreak: winstreaks.get(user.id) ?? 0,
        }))

        return NextResponse.json({ total, users })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}
