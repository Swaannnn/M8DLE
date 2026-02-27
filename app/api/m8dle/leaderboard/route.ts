import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { LeaderboardData, LeaderboardUser } from '@/types/leaderboard'
import { getNumberParamFromRequest } from '@/utils/requestUtils'
import constantsParams from '@/constants/constantsParams'

/**
 * Fonction utilitaire pour trier la liste des
 * profile utilisateur du leaderboard.
 *
 * @param userA Utilisateur A
 * @param userB Utilisateur B
 * @returns Valeur pour le trie
 */
function sortFunction(userA: LeaderboardUser, userB: LeaderboardUser) {
    if (userB.wins !== userA.wins) return userB.wins - userA.wins

    return userA.averageAttempts - userB.averageAttempts
}

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

        const total = await prisma.user.count({})
        const rawUsers = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                discordId: true,
                avatar: true,
                dailyResults: {
                    select: { attempts: true, success: true },
                },
                totalWins: true,
                totalAttempts: true,
                averageAttempts: true,
            },
            orderBy: [
                {
                    totalWins: "desc",
                },
                {
                    averageAttempts: "asc",
                },
            ],
            skip: constantsParams.LEADERBOARD_PAGE_SIZE * (page - 1),
            take: constantsParams.LEADERBOARD_PAGE_SIZE,
        })

        const users: LeaderboardUser[] = rawUsers.map((user) => {
            // Création du profile de leaderboard
            return {
                id: user.id,
                username: user.username,
                discordId: user.discordId,
                avatar: user.avatar ?? '',
                wins: user.totalWins,
                averageAttempts: user.averageAttempts,
            }
        })

        // users.sort(sortFunction)
        return NextResponse.json({ total, users })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
