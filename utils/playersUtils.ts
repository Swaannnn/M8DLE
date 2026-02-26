import players from '@/data/players.json'
import { Attempt } from '@/types/attempt'
import { Player } from '@/types/player'
import { getGameDayKey } from '@/utils/dateUtils'

const START_DAY_UTC = Date.UTC(2025, 0, 1)

const getDayNumberFromKey = (dayKey: string) => {
    const [year, month, day] = dayKey.split('-').map(Number)
    const currentDayUtc = Date.UTC(year, month - 1, day)
    return Math.floor((currentDayUtc - START_DAY_UTC) / (1000 * 60 * 60 * 24))
}

export function filterPlayersByAttempts(attempts: string[]): Player[] {
    return attempts.map((name) => players.find((p) => p.name === name)) as Player[]
}

export function filterPlayersNotInAttempts(attempts: string[]): Player[] {
    return players.filter((p) => !attempts.includes(p.name))
}

export function getPlayerOfTheDay() {
    const dayKey = getGameDayKey()
    const dayNumber = getDayNumberFromKey(dayKey)
    const index = ((dayNumber % players.length) + players.length) % players.length

    return players[index]
}
