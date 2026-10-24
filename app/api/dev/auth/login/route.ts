import { createSession } from '@/lib/auth/session'
import { claimGuestGame } from '@/lib/auth/guestGame'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import ApiErrorKey from '@/constants/apiErrorKeys'

export async function GET(request: NextRequest) {
    try {
        if (process.env.NODE_ENV != 'development') {
            return NextResponse.json({ error: ApiErrorKey.METHOD_NOT_ALLOWED }, { status: 405 })
        }

        const id = request.nextUrl.searchParams.get('userId')
        if (!id) {
            return NextResponse.json({ error: ApiErrorKey.MISSING_PARAMETER }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                discordId: true,
                role: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: ApiErrorKey.NOT_FOUND }, { status: 404 })
        }

        await createSession(id, user.discordId, user.role)

        // Même rattachement de la partie invité que sur la connexion Discord, pour que le
        // comportement en développement soit identique à la production.
        try {
            await claimGuestGame(user.id)
        } catch (error) {
            console.error('Erreur lors du rattachement de la partie invité:', error)
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.AUTH_FAILED }, { status: 500 })
    }
}
