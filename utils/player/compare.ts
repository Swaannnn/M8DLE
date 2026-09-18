import { getAge, getYear } from '@/utils/dateUtils'
import type { Player } from '@/types/player'

const GENTLE_MATES = 'Gentle Mates'

/** Essai plus grand (1), égal (0) ou plus petit (-1) que la réponse. */
type Sign = -1 | 0 | 1

/**
 * Indices d'un essai, calculés côté serveur et envoyés au client.
 *
 * Ne doit contenir que des indications *relatives* : jamais une valeur de la réponse, ni de
 * quoi la reconstituer. C'est pourquoi les écarts sont réduits à leur signe — transmettre
 * l'écart réel avec la valeur de l'essai suffirait à retrouver le joueur du jour.
 */
export type PlayerComparison = {
    player: boolean
    game: boolean
    nationality: boolean
    joinDate: Sign
    previousOrganization: boolean
    lastOrganization: boolean
    age: Sign
}

const compareValues = (value: number, target: number): Sign => (value === target ? 0 : value > target ? 1 : -1)

/** Recherche l'entrée Gentle Mates du joueur dans sa liste d'organisations */
const getGentleMatesEntry = (player: Player) => {
    const orgs = player.organizationPlayers ?? []
    return (
        orgs.find((op) => op.organization.name === GENTLE_MATES) ?? orgs.find((op) => !op.end) ?? orgs[orgs.length - 1]
    )
}

/** Obtient l'organisation actuelle (Club Actuel) du joueur */
export const getCurrentOrganization = (player: Player) => {
    const entry = getGentleMatesEntry(player)
    return entry ? entry.organization : { name: 'Inconnu', imageUrl: null }
}

/**
 * Obtient l'organisation précédente (Avant M8) du joueur : parmi les organisations qu'il a
 * quittées (date de fin renseignée) et hors Gentle Mates, celle dont la fin est la plus récente.
 */
export const getPreviousOrganization = (player: Player) => {
    let previousOrganization = null
    let latestEnd = -Infinity

    for (const op of player.organizationPlayers ?? []) {
        if (!op.end || op.organization.name === GENTLE_MATES) continue

        // `.toString()` car la date peut arriver sérialisée en chaîne depuis l'API.
        const endTime = new Date(op.end.toString()).getTime()
        if (endTime > latestEnd) {
            latestEnd = endTime
            previousOrganization = op.organization
        }
    }

    return previousOrganization ?? { name: 'Aucun', imageUrl: null }
}

/** Obtient l'année d'arrivée au club actuel (Gentle Mates) */
export const getPlayerJoinYear = (player: Player): number => {
    const entry = getGentleMatesEntry(player)
    return entry ? getYear(entry.start.toString()) : -1
}

export const comparePlayer = (player: Player, target: Player): PlayerComparison => ({
    player: player.id === target.id,
    game: Boolean(player.game?.name && player.game.name === target.game?.name),
    nationality: player.nationality.toLowerCase() === target.nationality.toLowerCase(),
    joinDate: compareValues(getPlayerJoinYear(player), getPlayerJoinYear(target)),
    previousOrganization: getPreviousOrganization(player).name === getPreviousOrganization(target).name,
    lastOrganization: getCurrentOrganization(player).name === getCurrentOrganization(target).name,
    age: compareValues(getAge(player.birthDate.toString()), getAge(target.birthDate.toString())),
})

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
