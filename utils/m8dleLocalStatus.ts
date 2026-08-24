import { M8dleStatus } from '@/types/M8dleStatus'
import { getGameDate } from '@/utils/dateUtils'

const M8DLE_LOCAL_STORAGE_KEY = 'm8dle'

/**
 * Récupère le statut M8DLE stocké en local (mode invité) pour le jour de jeu en cours.
 * Purge et renvoie `null` si aucune entrée n'existe ou si elle date d'un autre jour de jeu.
 */
export function getLocalM8dleStatus(): M8dleStatus | null {
    const storage = localStorage.getItem(M8DLE_LOCAL_STORAGE_KEY)
    if (!storage) return null

    const parsed = JSON.parse(storage)
    if (!parsed.date || new Date(parsed.date).getTime() !== getGameDate().getTime()) {
        localStorage.removeItem(M8DLE_LOCAL_STORAGE_KEY)
        return null
    }

    return {
        date: new Date(parsed.date),
        success: parsed.success ?? false,
        attempts: parsed.attempts ?? [],
    }
}

export function saveLocalM8dleStatus(status: M8dleStatus): void {
    localStorage.setItem(M8DLE_LOCAL_STORAGE_KEY, JSON.stringify(status))
}

export function createLocalM8dleStatus(): M8dleStatus {
    const status: M8dleStatus = { attempts: [], success: false, date: getGameDate() }
    saveLocalM8dleStatus(status)
    return status
}

export function clearLocalM8dleStatus(): void {
    localStorage.removeItem(M8DLE_LOCAL_STORAGE_KEY)
}
