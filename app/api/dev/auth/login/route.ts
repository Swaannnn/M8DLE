import { createSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        if (process.env.NODE_ENV != 'development') {
            return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 })
        }

        const id = request.nextUrl.searchParams.get('userId')
        if (!id) {
            return NextResponse.json({ error: 'Parameter "userId" is required' }, { status: 400 })
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
            return NextResponse.json({ error: 'User does not exists' }, { status: 400 })
        }

        await createSession(id, user.discordId, user.role)

        return NextResponse.json(user)
    } catch (error) {
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
}
