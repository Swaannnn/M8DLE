import { createSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import ApiErrorCode from '@/constants/apiErrorCodes'

export async function GET(request: NextRequest) {
    try {
        if (process.env.NODE_ENV != 'development') {
            return NextResponse.json({ error: ApiErrorCode.METHOD_NOT_ALLOWED }, { status: 405 })
        }

        const id = request.nextUrl.searchParams.get('userId')
        if (!id) {
            return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
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
            return NextResponse.json({ error: ApiErrorCode.NOT_FOUND }, { status: 404 })
        }

        await createSession(id, user.discordId, user.role)

        return NextResponse.json(user)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.AUTH_FAILED }, { status: 500 })
    }
}
