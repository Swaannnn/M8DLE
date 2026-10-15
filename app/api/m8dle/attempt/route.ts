import { NextRequest, NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth/session'
import { resolveGameOwner, type GameOwner } from '@/lib/auth/gameOwner'
import { getGameDate } from '@/utils/dateUtils'
import { isUniqueConstraintViolation } from '@/lib/prismaErrors'
import { AttemptDto } from '@/dto/AttemptDto'
import { ZodError } from 'zod'
import { getOrGeneratePlayerOfTheDay } from '@/utils/player/playerOfTheDay'
import { comparePlayer } from '@/utils/player/compare'
import { playerWithRelationsInclude } from '@/types/player'
import type { AttemptResponse } from '@/types/m8dleStatus'
import ApiErrorKey from '@/constants/apiErrorKeys'

const MAX_ATTEMPT_RETRIES = 3

type RecordAttemptResult =
    | { success: boolean; created: boolean }
    | { errorKey: (typeof ApiErrorKey)[keyof typeof ApiErrorKey]; status: number }

/**
 * Lit l'état du jour puis écrit la tentative. En cas d'écriture concurrente, la contrainte
 * unique rejette la nôtre : on relit l'état réel et on retente.
 */
async function recordAttempt(owner: GameOwner, gameDate: Date, playerId: string, isWin: boolean) {
    for (let retry = 0; retry < MAX_ATTEMPT_RETRIES; retry++) {
        const dailyResult = await prisma.dailyM8DLEResult.findFirst({
            where: { ...owner, date: gameDate },
            select: {
                id: true,
                success: true,
                attempts: {
                    select: { playerId: true, attemptNumber: true },
                    orderBy: { attemptNumber: 'asc' },
                },
            },
        })

        try {
            if (dailyResult) {
                if (dailyResult.success) {
                    return { errorKey: ApiErrorKey.ALREADY_SUCCESS, status: 400 } satisfies RecordAttemptResult
                }

                if (dailyResult.attempts.some((a) => a.playerId === playerId)) {
                    return { errorKey: ApiErrorKey.ALREADY_ATTEMPTED, status: 400 } satisfies RecordAttemptResult
                }

                await prisma.dailyM8DLEResult.update({
                    where: { id: dailyResult.id },
                    data: {
                        success: isWin,
                        attempts: {
                            create: {
                                playerId,
                                attemptNumber:
                                    (dailyResult.attempts[dailyResult.attempts.length - 1]?.attemptNumber ?? 0) + 1,
                            },
                        },
                    },
                })

                return { success: isWin, created: false } satisfies RecordAttemptResult
            }

            await prisma.dailyM8DLEResult.create({
                data: {
                    ...owner,
                    date: gameDate,
                    success: isWin,
                    attempts: { create: { attemptNumber: 1, playerId } },
                },
            })

            return { success: isWin, created: true } satisfies RecordAttemptResult
        } catch (error) {
            if (!isUniqueConstraintViolation(error)) throw error
        }
    }

    // Conflits répétés : le client peut retenter, ce n'est pas une panne serveur.
    return { errorKey: ApiErrorKey.CONFLICT, status: 409 } satisfies RecordAttemptResult
}

/**
 * Enregistre une tentative, pour un utilisateur connecté comme pour un invité.
 * `success` est calculé ici depuis le PlayerOtd : le client ne décide jamais de sa victoire.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const payload = AttemptDto.parse(body)

        const owner = await resolveGameOwner()
        const gameDate = getGameDate()

        const [playerOtd, attemptedPlayer] = await Promise.all([
            getOrGeneratePlayerOfTheDay(gameDate),
            prisma.player.findUnique({
                where: { id: payload.attempt },
                include: playerWithRelationsInclude,
            }),
        ])

        if (!playerOtd || !attemptedPlayer) {
            return NextResponse.json({ error: ApiErrorKey.NOT_FOUND }, { status: 404 })
        }

        const isWin = attemptedPlayer.id === playerOtd.id
        const result = await recordAttempt(owner, gameDate, attemptedPlayer.id, isWin)

        if ('errorKey' in result) {
            return NextResponse.json({ error: result.errorKey }, { status: result.status })
        }

        const response: AttemptResponse = {
            success: result.success,
            comparison: comparePlayer(attemptedPlayer, playerOtd),
            // La réponse n'est révélée qu'une fois la partie gagnée.
            playerOfTheDay: result.success ? playerOtd : null,
        }

        return NextResponse.json(response, { status: result.created ? 201 : 200 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json({ error: ApiErrorKey.BAD_REQUEST }, { status: 400 })
        }

        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session?.userId || session?.role !== Role.ADMIN) {
            return NextResponse.json({ error: ApiErrorKey.UNAUTHORIZED }, { status: 401 })
        }

        const id = req.nextUrl.searchParams.get('id')
        if (!id) {
            return NextResponse.json({ error: ApiErrorKey.MISSING_PARAMETER }, { status: 400 })
        }

        const attempt = await prisma.attempt.findUnique({ where: { id } })
        if (!attempt) {
            return NextResponse.json({ error: ApiErrorKey.NOT_FOUND }, { status: 404 })
        }

        await prisma.attempt.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: ApiErrorKey.INTERNAL_ERROR }, { status: 500 })
    }
}
