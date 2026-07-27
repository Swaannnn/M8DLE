import { CreateGameDto } from '@/dto/CreateGameDto'
import { UpdateGameDto } from '@/dto/UpdateGameDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            orderBy: { name: 'asc' },
        })
        return NextResponse.json(games)
    } catch {
        return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
        console.error(error)
        return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
    } catch {
        return NextResponse.json({ error: 'Failed to update game' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('gameId')
        if (!id) {
            return NextResponse.json({ error: 'Parameter "gameId" is required' }, { status: 400 })
        }

        if (!(await prisma.game.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: 'Game does not exist' }, { status: 400 })
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
        return NextResponse.json({ error: 'Failed to delete game' }, { status: 500 })
    }
}
