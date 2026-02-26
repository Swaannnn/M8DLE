import players from '@/data/players.json'
import { Player } from '@/types/player'
import { getGameDayKey } from '@/utils/dateUtils'

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

export function filterPlayersByAttempts(attempts: string[]): Player[] {
    return attempts.map((name) => players.find((p) => p.name === name)) as Player[]
}

export function filterPlayersNotInAttempts(playersList: Player[], attempts: string[]): Player[] {
    return playersList.filter((p) => !attempts.includes(p.name))
}

export function getPlayerOfTheDay() {
    const dayKey = getGameDayKey()
    const seed = hashString(dayKey)
    const random = seededRandom(seed)
    const index = Math.floor(random * players.length)

    return players[index]
}
