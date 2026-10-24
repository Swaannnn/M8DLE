import { CreateGameDto } from '@/dto/CreateGameDto'
import { UpdateGameDto } from '@/dto/UpdateGameDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import ApiErrorKey from '@/constants/apiErrorKeys'

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: { name: 'asc' },
        })
        return NextResponse.json(games)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.FETCH_FAILED }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        const content = CreateGameDto.parse(await req.json())
        const created = await prisma.game.create({
            data: {
                name: content.name,
                imageUrl: content.imageUrl,
            },
        })

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorKey.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.CREATE_FAILED }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        const content = UpdateGameDto.parse(await req.json())

        const updated = await prisma.game.update({
            where: { id: content.id },
            data: {
                name: content.name,
                imageUrl: content.imageUrl,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorKey.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.UPDATE_FAILED }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('gameId')
        if (!id) {
            return NextResponse.json({ error: ApiErrorKey.MISSING_PARAMETER }, { status: 400 })
        }

        if (!(await prisma.game.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: ApiErrorKey.NOT_FOUND }, { status: 404 })
        }

        // Unset gameId on associated players before deleting to avoid constraint issues
        await prisma.player.updateMany({
            where: { gameId: id },
            data: { gameId: null },
        })

        await prisma.game.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: ApiErrorKey.DELETE_FAILED }, { status: 500 })
    }
}
