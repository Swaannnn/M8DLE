import players from '@/data/players.json'

const START_DATE = new Date('2025-01-01T00:00:00Z')

export function getPlayerOfTheDay() {
    const now = Date.now()
    const adjustedTime = now - 2 * 60 * 60 * 1000
    const diff = adjustedTime - START_DATE.getTime()
    const dayNumber = Math.floor(diff / (1000 * 60 * 60 * 24))
    const index = dayNumber % players.length
    return players[index]
}
