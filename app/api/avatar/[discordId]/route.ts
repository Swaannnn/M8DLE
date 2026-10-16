import constantsApi from '@/constants/constantsApi'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy public d'avatar Discord.
 *
 * La synchronisation des avatars (Discord → BDD) est gérée par le cron
 * /api/cron/sync-avatars qui tourne chaque nuit à minuit.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ discordId: string }> }) {
    const { discordId } = await params

    const user = await prisma.user.findUnique({
        where: { discordId },
        select: { avatar: true },
    })

    if (!user) {
        return new NextResponse('User not found', { status: 404 })
    }

    if (!user.avatar) {
        return NextResponse.redirect(new URL('/images/default_avatar.jpg', request.url))
    }

    const discordAvatarUrl = `${constantsApi.AVATAR}/${discordId}/${user.avatar}`
    const cdnResponse = await fetch(discordAvatarUrl)

    if (cdnResponse.ok) {
        const contentType = cdnResponse.headers.get('content-type') ?? 'image/png'
        return new NextResponse(cdnResponse.body, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            },
        })
    }

    return NextResponse.redirect(new URL('/images/default_avatar.jpg', request.url))
}
