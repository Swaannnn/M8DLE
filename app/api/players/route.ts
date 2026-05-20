import { UpdatePlayerDto } from '@/dto/UpdatePlayerDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    try {
        const players = await prisma.player.findMany({
            include: {
                organizationPlayers: true,
            },
        })

        return NextResponse.json(players)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const content = UpdatePlayerDto.parse(await req.json())
        const updated = await prisma.player.update({
            where: { id: content.id },
            data: {
                name: content.name,
                birthDate: content.birthDate,
                imageUrl: content.imageUrl,
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update player' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('playerId')
        if (!id) {
            return NextResponse.json({ error: 'Parameter "playerId" is required' })
        }

        if (!(await prisma.player.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: 'Player does not exists' }, { status: 400 })
        }

        // Set DELETED_AT to NOW()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to delete player' }, { status: 500 })
    }
}
