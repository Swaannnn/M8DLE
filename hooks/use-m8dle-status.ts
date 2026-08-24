'use client'

import { useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
import type { Attempt, DailyM8DLEResult } from '@prisma/client'
import type { Player } from '@/types/player'
import type { M8dleStatus } from '@/types/M8dleStatus'
import { filterPlayersByAttempts, filterPlayersNotInAttempts, getPlayerOfTheDay } from '@/utils/playersUtils'
import { getGameDate } from '@/utils/dateUtils'
import { useAuth } from './use-auth'
import { fetcher } from '@/utils/fetcher'
import {
    clearLocalM8dleStatus,
    createLocalM8dleStatus,
    getLocalM8dleStatus,
    saveLocalM8dleStatus,
} from '@/utils/m8dleLocalStatus'

/**
 * Forme de la réponse de GET /api/m8dle/status, dérivée du modèle Prisma
 * (voir le `select` de app/api/m8dle/status/route.ts).
 */
type M8dleStatusResponse = Pick<DailyM8DLEResult, 'userId' | 'success'> & {
    attempts: Pick<Attempt, 'playerId'>[]
}

/**
 * Forme de la réponse de POST /api/m8dle/attempt (voir app/api/m8dle/attempt/route.ts).
 * C'est cette valeur, calculée côté serveur à partir du vrai PlayerOtd, qui fait foi.
 */
type AttemptResponse = Pick<DailyM8DLEResult, 'success'>

export const useM8dleStatus = () => {
    const { loggedOut } = useAuth()
    const { data: allPlayers = [], isLoading: playersLoading } = useSWR<Player[]>('/api/players', fetcher)
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([])
    const [win, setWin] = useState(false)
    const [statusLoading, setStatusLoading] = useState(true)

    /**
     * Synchronise le local storage de l'invité vers la BDD utilisateur
     */
    const syncLocalToUser = useCallback(async (state: M8dleStatus) => {
        if (state.attempts.length > 0) {
            try {
                await fetcher('/api/m8dle/attempt/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ attempts: state.attempts }),
                })
            } catch (err) {
                console.error('Erreur lors de la synchronisation des tentatives:', err)
            }
        }
        clearLocalM8dleStatus()
    }, [])

    useEffect(() => {
        if (playersLoading) return

        let cancelled = false

        const loadStatus = async () => {
            setStatusLoading(true)
            const guestState = getLocalM8dleStatus()
            let isWin = false
            let attemptIds: string[] = []

            if (!loggedOut) {
                if (guestState) await syncLocalToUser(guestState)

                try {
                    const data = await fetcher<M8dleStatusResponse>('/api/m8dle/status')
                    isWin = data.success
                    attemptIds = data.attempts.map((a) => a.playerId)
                } catch (error) {
                    console.error('Erreur lors de la récupération du statut:', error)
                }
            } else if (guestState) {
                isWin = guestState.success
                attemptIds = guestState.attempts
            } else {
                const status = createLocalM8dleStatus()
                isWin = status.success
                attemptIds = status.attempts
            }

            if (cancelled) return
            setWin(isWin)
            setSelectedPlayers(filterPlayersByAttempts(allPlayers, attemptIds))
            setAvailablePlayers(filterPlayersNotInAttempts(allPlayers, attemptIds))
            setStatusLoading(false)
        }

        loadStatus().catch(console.error)

        return () => {
            cancelled = true
        }
    }, [loggedOut, allPlayers, playersLoading, syncLocalToUser])

    /**
     * Ajoute un essai d'un joueur. Pour un utilisateur connecté, le résultat (`success`)
     * vient de la réponse serveur, seule source fiable puisqu'elle est calculée à partir
     * du vrai PlayerOtd stocké en base — jamais recalculé côté client.
     */
    const addAttempt = useCallback(
        async (player: Player) => {
            if (!loggedOut) {
                const updated = await fetcher<AttemptResponse>('/api/m8dle/attempt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ attempt: player.id }),
                })
                setWin(updated.success)
            } else {
                const playerOfTheDay = getPlayerOfTheDay(allPlayers)
                const isWin = playerOfTheDay ? player.id === playerOfTheDay.id : false
                const storage = getLocalM8dleStatus() ?? createLocalM8dleStatus()
                saveLocalM8dleStatus({
                    attempts: [...storage.attempts, player.id],
                    success: isWin,
                    date: getGameDate(),
                })
                setWin(isWin)
            }

            setSelectedPlayers((prev) => [...prev, player])
            setAvailablePlayers((prev) => filterPlayersNotInAttempts(prev, [player.id]))
        },
        [loggedOut, allPlayers]
    )

    return {
        allPlayers,
        selectedPlayers,
        availablePlayers,
        win,
        addAttempt,
        statusLoading: statusLoading || playersLoading,
    }
}
