import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentAdmin } from '@/lib/auth/currentUser'
import { resolveGameOwner, type GameOwner } from '@/lib/auth/gameOwner'
import { getGameDate } from '@/utils/dateUtils'
import { isUniqueConstraintViolation } from '@/lib/prismaErrors'
import { AttemptDto } from '@/dto/AttemptDto'
import { ZodError } from 'zod'
import { getPlayerOfTheDay } from '@/utils/player/playerOfTheDay'
import { getCatalogueWith } from '@/utils/player/catalogue'
import { comparePlayer } from '@/utils/player/compare'
import type { AttemptResponse } from '@/types/m8dleStatus'
import ApiErrorKey from '@/constants/apiErrorKeys'

const MAX_ATTEMPT_RETRIES = 3

type RecordAttemptResult =
    | { success: boolean; created: boolean }
    | { errorKey: (typeof ApiErrorKey)[keyof typeof ApiErrorKey]; status: number }

/**
 * Écrit la tentative en deux allers-retours vers la base : une lecture (deux requêtes en
 * parallèle), puis une écriture. En cas d'écriture concurrente, une contrainte unique rejette
 * la nôtre : on relit l'état réel et on retente.
 */
async function recordAttempt(owner: GameOwner, gameDate: Date, playerId: string, isWin: boolean) {
    const dailyResultWhere = { ...owner, date: gameDate }

    for (let retry = 0; retry < MAX_ATTEMPT_RETRIES; retry++) {
        const [dailyResult, attempts] = await Promise.all([
            prisma.dailyM8DLEResult.findFirst({
                where: dailyResultWhere,
                select: { id: true, success: true },
            }),
            prisma.attempt.findMany({
                where: { dailyResult: dailyResultWhere },
                select: { playerId: true, attemptNumber: true },
            }),
        ])

        try {
            if (!dailyResult) {
                await prisma.dailyM8DLEResult.create({
                    data: {
                        ...dailyResultWhere,
                        success: isWin,
                        attempts: { create: { attemptNumber: 1, playerId } },
                    },
                    select: { id: true },
                })

                return { success: isWin, created: true } satisfies RecordAttemptResult
            }

            if (dailyResult.success) {
                return { errorKey: ApiErrorKey.ALREADY_SUCCESS, status: 400 } satisfies RecordAttemptResult
            }

            if (attempts.some((a) => a.playerId === playerId)) {
                return { errorKey: ApiErrorKey.ALREADY_ATTEMPTED, status: 400 } satisfies RecordAttemptResult
            }

            const attempt = {
                playerId,
                attemptNumber: Math.max(0, ...attempts.map((a) => a.attemptNumber)) + 1,
            }

            if (isWin) {
                // `success` n'est écrit qu'à la victoire : le trigger de statistiques sur
                // DailyM8DLEResult ne se déclenche pas à chaque tentative.
                await prisma.dailyM8DLEResult.update({
                    where: { id: dailyResult.id },
                    data: { success: true, attempts: { create: attempt } },
                    select: { id: true },
                })
            } else {
                await prisma.attempt.create({
                    data: { ...attempt, dailyResultId: dailyResult.id },
                    select: { id: true },
                })
            }

            return { success: isWin, created: false } satisfies RecordAttemptResult
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

        // Joueur du jour et joueur tenté viennent du cache de l'instance : aucune requête à chaud.
        const [playerOtd, catalogue] = await Promise.all([
            getPlayerOfTheDay(gameDate),
            getCatalogueWith([payload.attempt]),
        ])
        const attemptedPlayer = catalogue.get(payload.attempt)

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
        if (!(await getCurrentAdmin())) {
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
