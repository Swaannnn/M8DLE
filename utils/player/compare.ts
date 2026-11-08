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
    const orgs = player.organizationPlayers ?? []
    const activeOrgs = orgs.filter((op) => !op.end)

    if (activeOrgs.length > 0) {
        const latestActive = activeOrgs.sort(
            (a, b) => new Date(b.start.toString()).getTime() - new Date(a.start.toString()).getTime()
        )[0]
        return latestActive.organization
    }

    return null
}

/**
 * Obtient l'organisation précédente (Avant M8) du joueur : hors Gentle Mates, la dernière
 * organisation rejointe avant sa (première) arrivée chez Gentle Mates. On se base sur la date
 * de début et non de fin, car un joueur peut rejoindre M8 avant la fin officielle de son
 * contrat précédent. Les équipes rejointes après M8 sont ignorées.
 */
export const getPreviousOrganization = (player: Player) => {
    const orgs = player.organizationPlayers ?? []
    // Les organisations arrivent triées par date de début : `find` donne la première arrivée chez M8.
    const gentleMatesEntry = orgs.find((op) => op.organization.name === GENTLE_MATES)
    if (!gentleMatesEntry) return null

    // `.toString()` car la date peut arriver sérialisée en chaîne depuis l'API.
    const joinTime = new Date(gentleMatesEntry.start.toString()).getTime()

    let previousOrganization = null
    let latestStart = -Infinity

    for (const op of orgs) {
        if (op.organization.name === GENTLE_MATES) continue

        const startTime = new Date(op.start.toString()).getTime()
        if (startTime < joinTime && startTime > latestStart) {
            latestStart = startTime
            previousOrganization = op.organization
        }
    }

    return previousOrganization
}

/** Obtient l'année d'arrivée à Gentle Mates */
export const getPlayerJoinYear = (player: Player): number => {
    const entry = getGentleMatesEntry(player)
    return entry ? getYear(entry.start.toString()) : -1
}

export const comparePlayer = (player: Player, target: Player): PlayerComparison => ({
    player: player.id === target.id,
    game: Boolean(player.game?.name && player.game.name === target.game?.name),
    nationality: player.nationality.toLowerCase() === target.nationality.toLowerCase(),
    joinDate: compareValues(getPlayerJoinYear(player), getPlayerJoinYear(target)),
    previousOrganization:
        (getPreviousOrganization(player)?.name ?? null) === (getPreviousOrganization(target)?.name ?? null),
    lastOrganization: (getCurrentOrganization(player)?.name ?? null) === (getCurrentOrganization(target)?.name ?? null),
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
