import { CreatePlayerDto } from '@/dto/CreatePlayerDto'
import { UpdatePlayerDto } from '@/dto/UpdatePlayerDto'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import ApiErrorCode from '@/constants/apiErrorCodes'

export async function GET() {
    try {
        const players = await prisma.player.findMany({
            orderBy: { id: 'asc' },
            include: {
                game: true,
                organizationPlayers: {
                    include: {
                        organization: true,
                    },
                    orderBy: {
                        start: 'asc',
                    },
                },
            },
        })

        return NextResponse.json(players)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.FETCH_FAILED }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const content = CreatePlayerDto.parse(await req.json())
        const created = await prisma.player.create({
            data: {
                name: content.name,
                birthDate: content.birthDate,
                imageUrl: content.imageUrl,
                nationality: content.nationality,
                gameId: content.gameId,
                organizationPlayers: {
                    create:
                        content.organizationPlayers?.map((org) => ({
                            start: org.start,
                            end: org.end,
                            organizationId: org.organizationId,
                        })) || [],
                },
            },
        })

        return NextResponse.json(created, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.CREATE_FAILED }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const content = UpdatePlayerDto.parse(await req.json())

        // Handle organizationPlayers update separately since Prisma's update is tricky with nested arrays
        if (content.organizationPlayers) {
            await prisma.organizationPlayer.deleteMany({
                where: { playerId: content.id },
            })
        }

        const updated = await prisma.player.update({
            where: { id: content.id },
            data: {
                name: content.name,
                birthDate: content.birthDate,
                imageUrl: content.imageUrl,
                nationality: content.nationality,
                gameId: content.gameId,
                ...(content.organizationPlayers && {
                    organizationPlayers: {
                        create: content.organizationPlayers.map((org) => ({
                            start: org.start,
                            end: org.end,
                            organizationId: org.organizationId,
                        })),
                    },
                }),
            },
        })

        return NextResponse.json(updated)
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorCode.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorCode.UPDATE_FAILED }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session || session.role != Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorCode.UNAUTHORIZED }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('playerId')
        if (!id) {
            return NextResponse.json({ error: ApiErrorCode.MISSING_PARAMETER }, { status: 400 })
        }

        if (!(await prisma.player.findUnique({ where: { id } }))) {
            return NextResponse.json({ error: ApiErrorCode.NOT_FOUND }, { status: 404 })
        }

        // Set DELETED_AT to NOW()
        await prisma.player.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: ApiErrorCode.DELETE_FAILED }, { status: 500 })
    }
}
