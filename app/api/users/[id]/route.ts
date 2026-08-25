import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import ApiErrorCode from '@/constants/apiErrorCodes'

/** Récupère un utilisateur via son identifiant */
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role != Role.ADMIN) {
        return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
    }

    const id = (await params).id
    if (!id) {
        return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
        return NextResponse.json({ error: ApiErrorCode.NOT_FOUND }, { status: 404 })
    }

    return NextResponse.json(user)
}

/** Modifie un utilisateur via son identifiant */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role != Role.ADMIN) {
        return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
    }

    const id = (await params).id
    if (!id) {
        return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
    }

    try {
        const body = await request.json()
        if (body.role !== Role.ADMIN && body.role !== Role.USER) {
            // FIXME: temp fix, need a better and reusable solution
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        const user = await prisma.user.update({
            where: { id },
            data: {
                role: body.role,
            },
        })
        return NextResponse.json(user)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.UPDATE_FAILED }, { status: 500 })
    }
}

/** Supprime un utilisateur via son identifiant */
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session || session.role != Role.ADMIN) {
        return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
    }

    const id = (await params).id
    if (!id) {
        return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } })
        if (!user) {
            return NextResponse.json({ error: ApiErrorCode.NOT_FOUND }, { status: 404 })
        }

        const deleted = await prisma.user.delete({ where: { id }, select: { discordId: true, username: true } })

        return NextResponse.json(deleted)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.DELETE_FAILED }, { status: 500 })
    }
}
