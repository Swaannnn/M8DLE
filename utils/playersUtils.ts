import { Player } from '@/types/player'
import { getGameDate } from '@/utils/dateUtils'

const hashString = (str: string) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

export function filterPlayersByAttempts(allPlayers: Player[], attempts: string[]): Player[] {
    if (!attempts || attempts.length === 0) return []
    return attempts
        .map((id) => allPlayers.find((p) => p.id === id))
        .filter((p): p is Player => p !== undefined)
}

export function filterPlayersNotInAttempts(allPlayers: Player[], attempts: string[]): Player[] {
    if (!attempts || attempts.length === 0) return allPlayers
    return allPlayers.filter((p) => !attempts.includes(p.id))
}

export function getPlayerOfTheDay(allPlayers: Player[]): Player | null {
    if (!allPlayers || allPlayers.length === 0) return null
    const dayKey = getGameDate().toISOString().slice(0, 10)
    const seed = hashString(dayKey)
    const random = seededRandom(seed)
    const index = Math.floor(random * allPlayers.length)

    return allPlayers[index]
}
