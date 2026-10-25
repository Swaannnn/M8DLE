'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'
import type { Player } from '@/types/player'
import { type ApiError, fetcher } from '@/utils/apiClient'
import type { AttemptResponse, M8dleStatus } from '@/types/m8dleStatus'
import type { PlayerComparison } from '@/utils/player/compare'
import { filterPlayersNotInAttempts } from '@/utils/player/filters'
import { useAuth } from './use-auth'
import { useShowApiErrorToast } from './use-api-error-toast'

/** Un essai joué, avec les indices calculés par le serveur. */
export type PlayedAttempt = {
    player: Player
    comparison: PlayerComparison
}

const EMPTY_STATUS: M8dleStatus = { success: false, attempts: [], playerOfTheDay: null }

export const useM8dleStatus = () => {
    const { loggedOut, loading: authLoading } = useAuth()
    const {
        data: players,
        error: playersError,
        isLoading: playersLoading,
    } = useSWR<Player[], ApiError>('/api/players', fetcher)
    // Le statut part en même temps que le catalogue : le serveur résout lui-même qui joue
    // depuis les cookies, il n'a besoin ni de /api/auth/me ni de /api/players.
    const {
        data: status,
        error: statusError,
        isLoading: statusLoading,
        mutate: mutateStatus,
    } = useSWR<M8dleStatus, ApiError>('/api/m8dle/status', fetcher)
    const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null)
    // Verrou synchrone : l'état React ne serait vu qu'au rendu suivant, trop tard pour un double clic.
    const isSubmitting = useRef(false)
    const showApiErrorToast = useShowApiErrorToast()

    useEffect(() => {
        if (statusError) console.error('Erreur lors de la récupération du statut:', statusError)
    }, [statusError])

    // L'identité change sans navigation complète (déconnexion) : on relit le statut. La
    // connexion, elle, recharge la page et rattache la partie invité côté serveur
    // (voir lib/auth/guestGame.ts).
    const lastLoggedOut = useRef<boolean | null>(null)
    useEffect(() => {
        if (authLoading) return
        if (lastLoggedOut.current !== null && lastLoggedOut.current !== loggedOut) mutateStatus()
        lastLoggedOut.current = loggedOut
    }, [loggedOut, authLoading, mutateStatus])

    // Référence stable : sinon un échec de /api/players recrée un tableau à chaque rendu.
    const allPlayers = useMemo(() => players ?? [], [players])
    const currentStatus = status ?? EMPTY_STATUS

    const attempts = useMemo(() => {
        const playersById = new Map(allPlayers.map((player) => [player.id, player]))
        return currentStatus.attempts.flatMap(({ playerId, comparison }): PlayedAttempt[] => {
            const player = playersById.get(playerId)
            return player ? [{ player, comparison }] : []
        })
    }, [allPlayers, currentStatus.attempts])

    const availablePlayers = useMemo(
        () =>
            filterPlayersNotInAttempts(allPlayers, [
                ...currentStatus.attempts.map((attempt) => attempt.playerId),
                ...(pendingPlayer ? [pendingPlayer.id] : []),
            ]),
        [allPlayers, currentStatus.attempts, pendingPlayer]
    )

    /**
     * Ajoute un essai. Le joueur est affiché tout de suite en attente ; les indices et la
     * victoire viennent du serveur, seule source fiable. En cas d'échec l'erreur part en toast
     * et le statut est relu pour rester aligné sur le serveur : l'appelant n'attend pas la promesse.
     */
    const addAttempt = useCallback(
        async (player: Player) => {
            if (isSubmitting.current) return
            isSubmitting.current = true
            setPendingPlayer(player)

            try {
                const result = await fetcher<AttemptResponse>('/api/m8dle/attempt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ attempt: player.id }),
                })

                await mutateStatus(
                    (prev = EMPTY_STATUS) => ({
                        success: result.success,
                        playerOfTheDay: result.playerOfTheDay,
                        attempts: [...prev.attempts, { playerId: player.id, comparison: result.comparison }],
                    }),
                    { revalidate: false }
                )
            } catch (error) {
                showApiErrorToast(error)
                mutateStatus()
            } finally {
                isSubmitting.current = false
                setPendingPlayer(null)
            }
        },
        [mutateStatus, showApiErrorToast]
    )

    return {
        allPlayers,
        playersError,
        attempts,
        availablePlayers,
        pendingPlayer,
        win: currentStatus.success,
        playerOfTheDay: currentStatus.playerOfTheDay,
        addAttempt,
        statusLoading: statusLoading || playersLoading,
    }
}
