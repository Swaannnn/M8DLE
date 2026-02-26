import { exchangeCodeForToken, getDiscordUser } from '@/lib/auth/discord'
import { createSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const redirection = new URL('/', request.url)
    const code = request.nextUrl.searchParams.get('code')
    if (!code) {
        return NextResponse.redirect(redirection)
    }

    try {
        const tokens = await exchangeCodeForToken(code)
        const discordUser = await getDiscordUser(tokens.access_token)

        const user = await prisma.user.upsert({
            where: { discordId: discordUser.id },
            update: {
                username: discordUser.username,
                discriminator: discordUser.discriminator,
                avatar: discordUser.avatar,
                email: discordUser.email,
            },
            create: {
                discordId: discordUser.id,
                username: discordUser.username,
                discriminator: discordUser.discriminator,
                avatar: discordUser.avatar,
                email: discordUser.email,
            },
        })

        await createSession(user.id, user.discordId, user.role)

        return NextResponse.redirect(redirection)
    } catch (error) {
        console.error('Auth Error:', error)
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
}
