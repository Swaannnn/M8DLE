'use client'

import { useEffect, useState } from 'react'
import playersData from '@/data/players.json'
import type { Player } from '@/types/player'
import { filterPlayersByAttempts, filterPlayersNotInAttempts, getPlayerOfTheDay } from '@/utils/playersUtils'
import { getGameDate } from '@/utils/dateUtils'
import { useAuth } from './use-auth'
import { M8dleStatus } from '@/types/M8dleStatus'
import { fetcher } from '@/utils/fetcher'

const M8DLE_KEY = 'm8dle'

export const useM8dleStatus = () => {
    const { loggedOut } = useAuth()
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>(playersData)
    const [win, setWin] = useState(false)
    const [statusLoading, setStatusLoading] = useState(true)

    /**
     * Mets à jour les données stocké dans le local
     * storage de l'utilisateur dans son user stocké
     * en base de données.
     *
     * @param state status
     */
    const syncLocalToUser = async (state: M8dleStatus) => {
        if (state.attempts.length > 0 || state.isWin) {
            await fetcher('/api/m8dle/attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attempts: state.attempts,
                    isWin: state.isWin,
                }),
            })

            localStorage.removeItem(M8DLE_KEY)
        }
    }

    /**
     * Vérifie si dans le local storage on
     * retrouve bien le status M8DLE
     *
     * @returns status s'il existe
     */
    const getLocalStatus = (): M8dleStatus | null => {
        const storage = localStorage.getItem(M8DLE_KEY)
        if (storage) {
            const json = JSON.parse(storage)
            if (!json.date || new Date(json.date).getTime() !== getGameDate().getTime()) {
                localStorage.removeItem(M8DLE_KEY)
                return null
            }

            const status: M8dleStatus = {
                date: new Date(json.date),
                isWin: json.isWin,
                attempts: json.attempts,
            }

            return status
        }

        return null
    }

    /**
     * Créer et stocker un M8dleStatus vide
     * dans le local storage du navigateur.
     *
     * @returns status
     */
    const createLocalStatus = (): M8dleStatus => {
        const status: M8dleStatus = { attempts: [], isWin: false, date: getGameDate() }
        localStorage.setItem(M8DLE_KEY, JSON.stringify(status))

        return status
    }

    /**
     * Ajoute un essai à l'utilisateur.
     *
     * @param player
     */
    const addAttempt = async (player: Player) => {
        const isWin = player.name === getPlayerOfTheDay().name

        if (!loggedOut) {
            await fetcher('/api/m8dle/attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attempts: [player.name], isWin }),
            })
        } else {
            const storage = getLocalStatus() ?? createLocalStatus()
            const attempts = [...storage.attempts, player.name]

            localStorage.setItem(M8DLE_KEY, JSON.stringify({ attempts, isWin, date: getGameDate() }))
        }

        setWin(isWin)
        setSelectedPlayers((prev) => [...prev, player])
        setAvailablePlayers((prev) => filterPlayersNotInAttempts(prev, [player.name]))
    }

    useEffect(() => {
        const loadStatus = async () => {
            setStatusLoading(true)
            const guestState = getLocalStatus()
            let isWin: boolean
            let attempts: string[]

            if (!loggedOut) {
                if (guestState) await syncLocalToUser(guestState)

                try {
                    const data = await fetcher<M8dleStatus>('/api/m8dle/status')
                    attempts = data.attempts
                    isWin = data.isWin
                } catch (error) {
                    console.error('Erreur lors de la récupération du statut:', error)
                    attempts = []
                    isWin = false
                }
            } else {
                if (!guestState) {
                    const status = createLocalStatus()
                    isWin = status.isWin
                    attempts = status.attempts
                } else {
                    attempts = guestState.attempts
                    isWin = guestState.isWin
                }
            }

            setWin(isWin)
            setSelectedPlayers(filterPlayersByAttempts(attempts))
            setAvailablePlayers(filterPlayersNotInAttempts(playersData, attempts))
            setStatusLoading(false)
        }
        loadStatus().catch(console.error)
    }, [loggedOut])

    return { selectedPlayers, availablePlayers, win, addAttempt, statusLoading }
}
