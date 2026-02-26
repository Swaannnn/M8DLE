import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { LeaderboardData } from '@/types/leaderboard'

// Nombre d'élément dans une page pour la pagination
const MAX_PER_PAGE = 20

/**
 * Fonction utilitaire pour trier la liste des
 * profile utilisateur du leaderboard.
 *
 * @param userA Utilisateur A
 * @param userB Utilisateur B
 * @returns Valeur pour le trie
 */
function sortFunction(userA: LeaderboardData, userB: LeaderboardData) {
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
export async function GET({ params }: { params: Promise<{ page: number }> }) {
    try {
        let page = (await params).page

        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                discordId: true,
                avatar: true,
                dailyResults: {
                    select: { attempts: true, success: true },
                },
                _count: {
                    select: {
                        dailyResults: {
                            where: { success: true },
                        },
                    },
                },
            },
            skip: MAX_PER_PAGE * page,
            take: MAX_PER_PAGE,
        })

        const stats: LeaderboardData[] = users.map((user) => {
            const wins = user._count.dailyResults
            const totalAttempts = user.dailyResults.reduce((acc, dr) => {
                let len = Array.isArray(dr.attempts) ? dr.attempts.length : 0

                return acc + len
            }, 0)
            const averageAttempts = user.dailyResults.length > 0 ? totalAttempts / user.dailyResults.length : 0

            // Création du profile de leaderboard
            return {
                id: user.id,
                username: user.username,
                discordId: user.discordId,
                avatar: user.avatar ?? '',
                wins,
                averageAttempts: Number(averageAttempts.toFixed(2)),
            }
        })

        stats.sort(sortFunction)

        return NextResponse.json(stats)
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
