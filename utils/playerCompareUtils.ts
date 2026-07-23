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

/** Recherche l'entrée Gentle Mates du joueur dans sa liste d'organisations */
const getGentleMatesEntry = (player: Player) => {
    const orgs = player.organizationPlayers ?? []
    const index = orgs.findIndex((op) => op.organization.name === 'Gentle Mates')
    const entry = index !== -1 ? orgs[index] : orgs.find((op) => !op.end) ?? orgs[orgs.length - 1]
    return { orgs, index, entry }
}

/** Obtient l'organisation actuelle (Club Actuel) du joueur */
export const getCurrentOrganization = (player: Player) => {
    const { entry } = getGentleMatesEntry(player)
    return entry ? entry.organization : { name: 'Inconnu', imageUrl: null }
}

/** Obtient l'organisation précédente (Avant M8) du joueur */
export const getPreviousOrganization = (player: Player) => {
    const { orgs, index } = getGentleMatesEntry(player)
    if (index > 0) {
        return orgs[index - 1].organization
    }
    return { name: 'Aucun', imageUrl: null }
}

/** Obtient l'année d'arrivée au club actuel (Gentle Mates) */
export const getPlayerJoinYear = (player: Player): number => {
    const { entry } = getGentleMatesEntry(player)
    return entry ? getYear(entry.start.toString()) : -1
}

export const comparePlayer = (player: Player, target: Player): PlayerComparison => {
    const joinDatePlayer = getPlayerJoinYear(player)
    const agePlayer = getAge(player.birthDate.toString())
    const currentOrg = getCurrentOrganization(player)
    const prevOrg = getPreviousOrganization(player)

    const targetJoinDate = getPlayerJoinYear(target)
    const targetAge = getAge(target.birthDate.toString())
    const targetCurrentOrg = getCurrentOrganization(target)
    const targetPrevOrg = getPreviousOrganization(target)

    return {
        player: player.id === target.id,
        game: Boolean(player.game?.name && player.game.name === target.game?.name),
        nationality: player.nationality.toLowerCase() === target.nationality.toLowerCase(),
        joinDate: joinDatePlayer - targetJoinDate,
        previousOrganization: prevOrg.name === targetPrevOrg.name,
        lastOrganization: currentOrg.name === targetCurrentOrg.name,
        age: agePlayer - targetAge,
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
