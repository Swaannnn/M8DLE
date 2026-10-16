import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getDiscordUserById } from '@/lib/auth/discord'
import ApiErrorKey from '@/constants/apiErrorKeys'

/**
 * Synchronise les avatars Discord de tous les utilisateurs en BDD.
 *
 * Pour chaque utilisateur, appelle l'API Discord (Bot token) et met à jour
 * le hash d'avatar et le username si nécessaire. Couvre tous les cas :
 *   - Utilisateur sans avatar qui en a ajouté un
 *   - Utilisateur avec un avatar obsolète (hash 404 sur le CDN)
 *   - Utilisateur qui a supprimé son avatar
 *
 * Déclenché par le Cron Job Vercel défini dans vercel.json à 00h00 chaque jour,
 * qui injecte `Authorization: Bearer ${CRON_SECRET}`.
 */
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
    }

    try {
        const users = await prisma.user.findMany({
            select: { discordId: true, avatar: true, username: true },
        })

        let updated = 0
        let failed = 0

        for (const user of users) {
            try {
                const freshUser = await getDiscordUserById(user.discordId)

                const avatarChanged = freshUser.avatar !== user.avatar
                const usernameChanged = freshUser.username !== user.username

                if (avatarChanged || usernameChanged) {
                    await prisma.user.update({
                        where: { discordId: user.discordId },
                        data: {
                            avatar: freshUser.avatar,
                            username: freshUser.username,
                        },
                    })
                    updated++
                }
            } catch (err) {
                console.error(`Failed to sync avatar for Discord user ${user.discordId}:`, err)
                failed++
            }
        }

        console.log(`[sync-avatars] ${updated} updated, ${failed} failed out of ${users.length} users`)
        return NextResponse.json({ total: users.length, updated, failed })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}
