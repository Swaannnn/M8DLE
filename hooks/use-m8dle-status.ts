'use client'

import { useEffect, useState } from 'react'
import playersData from '@/data/players.json'
import type { Player } from '@/types/player'
import { filterPlayersByAttempts, getPlayerOfTheDay } from '@/utils/playersUtils'
import { getGameDate, getGameDayKey } from '@/utils/dateUtils'
import { useAuth } from './use-auth'
import { M8dleStatus } from '@/types/M8dleStatus'
import { fetcher } from '@/utils/fetcher'
import { Attempt } from '@/types/attempt'

const M8DLE_KEY = 'm8dle'

export const useM8dleStatus = () => {
    const { user } = useAuth()
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>(playersData)
    const [win, setWin] = useState(false)
    const [statusLoading, setStatusLoading] = useState(true)

    /**
     * Lit le local storage du navigateur
     * et récupère les données de jeu de
     * l'utilisateur.
     *
     * @returns Status
     */
    const getGuestState = (): M8dleStatus => {
        const storage = localStorage.getItem(M8DLE_KEY)
        const currentDateKey = getGameDayKey()

        if (!storage) {
            return { attempts: [], hasWin: false, date: getGameDate() }
        } else {
            const json = JSON.parse(storage)
            if (json.date && json.date !== currentDateKey) {
                localStorage.removeItem(M8DLE_KEY)
                return { attempts: [], hasWin: false, date: getGameDate() }
            }

            const attempts = Array.isArray(json.attempts) ? json.attempts : []
            const hasWin = json.hasWin === true
            const date = json.date ? new Date(json.date) : getGameDate()

            return { attempts, hasWin, date }
        }
    }

    /**
     * Mets à jour les données stocké dans le local
     * storage de l'utilisateur dans son user stocké
     * en base de données.
     *
     * @param state status
     */
    const syncLocalToUser = async (state: M8dleStatus) => {
        if (state.attempts.length > 0 || state.hasWin) {
            await fetcher<Attempt>('/api/m8dle/attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attempts: state.attempts,
                    hasWin: state.hasWin,
                }),
            })

            localStorage.removeItem(M8DLE_KEY)
        }
    }

    /**
     * Mets à jour l'état actuel de la partie
     * de l'utilisateur.
     */
    const fetchStatus = async () => {
        setStatusLoading(true)
        const guestState = getGuestState()
        let hasWin: boolean
        let attempts: string[]
        if (user) {
            // Handle if logged
            syncLocalToUser(guestState)
            const data = await fetcher<M8dleStatus>('/api/m8dle/status')
            attempts = data.attempts
            hasWin = data.hasWin
        } else {
            // Handle if guest
            attempts = guestState.attempts
            hasWin = guestState.hasWin

            if ((attempts = [])) {
                // Ajoute dans local storage
                localStorage.setItem(M8DLE_KEY, JSON.stringify({ attempts, hasWin, date: getGameDayKey() }))
            }
        }

        setWin(hasWin)
        setSelectedPlayers(filterPlayersByAttempts(attempts))
        setAvailablePlayers(playersData.filter((p) => attempts.includes(p.name)))
        setStatusLoading(false)
    }

    /**
     * Ajoute un essai à l'utilisateur.
     *
     * @param player
     */
    const addAttempt = async (player: Player) => {
        const isWin = player.name === getPlayerOfTheDay().name

        if (user) {
            await fetch('/api/m8dle/attempt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName: player.name, isWin }),
            })
        } else {
            const saved = JSON.parse(localStorage.getItem(M8DLE_KEY) || '{}')
            const attempts = [...(saved.attempts || []), player.name]
            const hasWin = saved.hasWin || isWin
            localStorage.setItem(M8DLE_KEY, JSON.stringify({ attempts, hasWin, date: getGameDayKey() }))
        }

        setSelectedPlayers((prev) => [...prev, player])
        setAvailablePlayers((prev) => prev.filter((p) => p.name !== player.name))
        if (isWin) setWin(true)
    }

    useEffect(() => {
        fetchStatus()
    }, [user])

    return { selectedPlayers, availablePlayers, win, addAttempt, statusLoading }
}
