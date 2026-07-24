'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import type { Player } from '@/types/player'
import { filterPlayersByAttempts, filterPlayersNotInAttempts, getPlayerOfTheDay } from '@/utils/playersUtils'
import { getGameDate } from '@/utils/dateUtils'
import { useAuth } from './use-auth'
import { M8dleStatus } from '@/types/M8dleStatus'
import { fetcher } from '@/utils/fetcher'

const M8DLE_KEY = 'm8dle'

type RawApiStatusResponse = {
    userId?: string
    success?: boolean
    isWin?: boolean
    attempts: Array<string | { playerId: string }>
}

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
    const syncLocalToUser = async (state: M8dleStatus) => {
        if (state.attempts.length > 0) {
            try {
                await fetcher('/api/m8dle/attempt/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        attempts: state.attempts,
                    }),
                })
            } catch (err) {
                console.error('Erreur lors de la synchronisation des tentatives:', err)
            }
        }
        localStorage.removeItem(M8DLE_KEY)
    }

    /**
     * Vérifie si le statut M8DLE est dans le local storage
     */
    const getLocalStatus = (): M8dleStatus | null => {
        const storage = localStorage.getItem(M8DLE_KEY)
        if (storage) {
            const json = JSON.parse(storage)
            if (!json.date || new Date(json.date).getTime() !== getGameDate().getTime()) {
                localStorage.removeItem(M8DLE_KEY)
                return null
            }

            return {
                date: new Date(json.date),
                success: json.success ?? json.isWin ?? false,
                attempts: json.attempts ?? [],
            }
        }
        return null
    }

    /**
     * Crée un statut M8DLE vide dans le local storage
     */
    const createLocalStatus = (): M8dleStatus => {
        const status: M8dleStatus = { attempts: [], success: false, date: getGameDate() }
        localStorage.setItem(M8DLE_KEY, JSON.stringify(status))
        return status
    }

    /**
     * Ajoute un essai d'un joueur
     */
    const addAttempt = async (player: Player) => {
        const playerOfTheDay = getPlayerOfTheDay(allPlayers)
        const isWin = playerOfTheDay ? player.id === playerOfTheDay.id : false

        if (!loggedOut) {
            await fetcher('/api/m8dle/attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attempt: player.id }),
            })
        } else {
            const storage = getLocalStatus() ?? createLocalStatus()
            const attempts = [...storage.attempts, player.id]
            localStorage.setItem(M8DLE_KEY, JSON.stringify({ attempts, success: isWin, date: getGameDate() }))
        }

        setWin(isWin)
        setSelectedPlayers((prev) => [...prev, player])
        setAvailablePlayers((prev) => filterPlayersNotInAttempts(prev, [player.id]))
    }

    useEffect(() => {
        if (playersLoading) return

        const loadStatus = async () => {
            setStatusLoading(true)
            const guestState = getLocalStatus()
            let isWin = false
            let attemptIds: string[] = []

            if (!loggedOut) {
                if (guestState) await syncLocalToUser(guestState)

                try {
                    const data = await fetcher<RawApiStatusResponse>('/api/m8dle/status')
                    isWin = data.success ?? data.isWin ?? false
                    attemptIds = (data.attempts ?? []).map((a) => (typeof a === 'string' ? a : a.playerId))
                } catch (error) {
                    console.error('Erreur lors de la récupération du statut:', error)
                    attemptIds = []
                    isWin = false
                }
            } else {
                if (!guestState) {
                    const status = createLocalStatus()
                    isWin = status.success
                    attemptIds = status.attempts
                } else {
                    attemptIds = guestState.attempts
                    isWin = guestState.success
                }
            }

            setWin(isWin)
            setSelectedPlayers(filterPlayersByAttempts(allPlayers, attemptIds))
            setAvailablePlayers(filterPlayersNotInAttempts(allPlayers, attemptIds))
            setStatusLoading(false)
        }

        loadStatus().catch(console.error)
    }, [loggedOut, allPlayers, playersLoading])

    return { allPlayers, selectedPlayers, availablePlayers, win, addAttempt, statusLoading: statusLoading || playersLoading }
}

