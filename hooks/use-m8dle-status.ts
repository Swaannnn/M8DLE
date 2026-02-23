'use client'

import { useEffect, useState } from 'react'
import playersData from '@/data/players.json'
import type { Player } from '@/types/player'
import { getPlayerOfTheDay } from '@/utils/getPlayerOfTheDay'
import { getGameDayKey } from '@/utils/dateUtils'
import { useAuth } from './use-auth'

const M8DLE_KEY = 'm8dle'

export const useM8dleStatus = () => {
    const { user } = useAuth()
    const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>(playersData)
    const [win, setWin] = useState(false)
    const [statusLoading, setStatusLoading] = useState(true)

    const getGuestState = () => {
        const saved = JSON.parse(localStorage.getItem(M8DLE_KEY) || '{}')
        const currentDateKey = getGameDayKey()

        if (saved.date && saved.date !== currentDateKey) {
            localStorage.removeItem(M8DLE_KEY)
            return { attempts: [], hasWin: false }
        }

        const attempts = Array.isArray(saved.attempts) ? saved.attempts : []
        const hasWin = saved.hasWin === true

        return { attempts, hasWin, date: saved.date ?? currentDateKey }
    }

    useEffect(() => {
        const fetchStatus = async () => {
            setStatusLoading(true)
            if (user) {
                try {
                    const guestState = getGuestState()
                    if (guestState.attempts.length > 0 || guestState.hasWin) {
                        const syncRes = await fetch('/api/m8dle/attempt', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                attempts: guestState.attempts,
                                hasWin: guestState.hasWin,
                            }),
                        })

                        if (syncRes.ok) localStorage.removeItem(M8DLE_KEY)
                    }

                    const res = await fetch('/api/m8dle/status')
                    const data = await res.json()
                    setWin(data.hasWin)
                    const selected = data.attempts
                        .map((name: string) => playersData.find((p) => p.name === name))
                        .filter(Boolean) as Player[]
                    setSelectedPlayers(selected)
                    setAvailablePlayers(playersData.filter((p) => !data.attempts.includes(p.name)))
                } catch (err) {
                    console.error('Error fetching M8DLE status', err)
                }
            } else {
                const guestState = getGuestState()
                const guestAttempts = guestState.attempts || []
                setWin(guestState.hasWin || false)
                const selected = guestAttempts
                    .map((name: string) => playersData.find((p) => p.name === name))
                    .filter(Boolean) as Player[]
                setSelectedPlayers(selected)
                setAvailablePlayers(playersData.filter((p) => !guestAttempts.includes(p.name)))
            }
            setStatusLoading(false)
        }

        fetchStatus()
    }, [user])

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

    return { selectedPlayers, availablePlayers, win, addAttempt, statusLoading }
}
