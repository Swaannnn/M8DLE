'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import type { Player } from '@/types/player'
import type { ApiError } from '@/utils/apiError'
import type { AttemptResponse, M8dleStatus } from '@/types/m8dleStatus'
import type { PlayerComparison } from '@/utils/playerCompareUtils'
import { filterPlayersNotInAttempts } from '@/utils/playersUtils'
import { useAuth } from './use-auth'
import { useShowApiErrorToast } from './use-api-error-toast'
import { fetcher } from '@/utils/fetcher'

/** Un essai joué, avec les indices calculés par le serveur. */
export type PlayedAttempt = {
    player: Player
    comparison: PlayerComparison
}

const EMPTY_STATE = {
    win: false,
    attempts: [] as PlayedAttempt[],
    playerOfTheDay: null as Player | null,
}

export const useM8dleStatus = () => {
    const { loggedOut, loading: authLoading } = useAuth()
    const {
        data: players,
        error: playersError,
        isLoading: playersLoading,
    } = useSWR<Player[], ApiError>('/api/players', fetcher)
    // Référence stable : sinon un échec de /api/players recrée un tableau à chaque rendu et
    // relance l'effet en boucle.
    const allPlayers = useMemo(() => players ?? [], [players])
    const [state, setState] = useState(EMPTY_STATE)
    const [statusLoading, setStatusLoading] = useState(true)
    const showApiErrorToast = useShowApiErrorToast()

    const availablePlayers = useMemo(
        () =>
            filterPlayersNotInAttempts(
                allPlayers,
                state.attempts.map((attempt) => attempt.player.id)
            ),
        [allPlayers, state.attempts]
    )

    // Le serveur résout lui-même qui joue depuis les cookies ; `loggedOut` ne sert qu'à relire
    // le statut quand l'identité change. Le rattachement de la partie invité se fait à la
    // création de session (voir utils/guestGameUtils.ts).
    useEffect(() => {
        if (authLoading || playersLoading) return

        let cancelled = false

        const loadStatus = async () => {
            setStatusLoading(true)

            let loaded = EMPTY_STATE

            try {
                const status = await fetcher<M8dleStatus>('/api/m8dle/status')
                const playersById = new Map(allPlayers.map((player) => [player.id, player]))

                loaded = {
                    win: status.success,
                    playerOfTheDay: status.playerOfTheDay,
                    attempts: status.attempts.flatMap(({ playerId, comparison }) => {
                        const player = playersById.get(playerId)
                        return player ? [{ player, comparison }] : []
                    }),
                }
            } catch (error) {
                console.error('Erreur lors de la récupération du statut:', error)
            }

            if (cancelled) return
            setState(loaded)
            setStatusLoading(false)
        }

        loadStatus().catch(console.error)

        return () => {
            cancelled = true
        }
    }, [loggedOut, authLoading, allPlayers, playersLoading])

    /**
     * Ajoute un essai. Les indices et la victoire viennent du serveur, seule source fiable.
     * En cas d'échec l'essai n'est pas affiché et l'erreur part en toast : l'appelant n'attend
     * pas la promesse.
     */
    const addAttempt = useCallback(
        async (player: Player) => {
            let result: AttemptResponse
            try {
                result = await fetcher<AttemptResponse>('/api/m8dle/attempt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ attempt: player.id }),
                })
            } catch (error) {
                showApiErrorToast(error)
                return
            }

            setState((prev) => ({
                win: result.success,
                playerOfTheDay: result.playerOfTheDay,
                attempts: [...prev.attempts, { player, comparison: result.comparison }],
            }))
        },
        [showApiErrorToast]
    )

    return {
        allPlayers,
        playersError,
        attempts: state.attempts,
        availablePlayers,
        win: state.win,
        playerOfTheDay: state.playerOfTheDay,
        addAttempt,
        statusLoading: statusLoading || playersLoading,
    }
}
