import { getAge, getYear } from './dateUtils'
import type { Player } from '@/types/player'

export type PlayerComparison = {
    player: boolean
    game: boolean
    nationality: boolean
    joinDate: number
    previousOrganization: boolean
    lastOrganization: boolean
    age: number
    joinDatePlayer: number
    agePlayer: number
}

export const comparePlayer = (player: Player, target: Player): PlayerComparison => {
    const joinDatePlayer = getYear(player.joinDate)
    const joinDateTarget = getYear(target.joinDate)
    const agePlayer = getAge(player.birthDate)
    const ageTarget = getAge(target.birthDate)

    return {
        player: player.name === target.name,
        game: player.game.name === target.game.name,
        nationality: player.nationality === target.nationality,
        joinDate: joinDatePlayer - joinDateTarget,
        previousOrganization: player.previousOrganization.name === target.previousOrganization.name,
        lastOrganization: player.lastOrganization.name === target.lastOrganization.name,
        age: agePlayer - ageTarget,
        joinDatePlayer,
        agePlayer,
    }
}

export const toEmojiRow = (comparison: PlayerComparison): string =>
    [
        comparison.game,
        comparison.nationality,
        comparison.joinDate === 0,
        comparison.previousOrganization,
        comparison.lastOrganization,
        comparison.age === 0,
    ]
        .map((r) => (r ? '🟪' : '⬛'))
        .join('')
