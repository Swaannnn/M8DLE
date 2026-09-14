import type { PlayerComparison } from '@/utils/playerCompareUtils'
import type { Player } from '@/types/player'

/** Un essai et les indices calculés côté serveur. */
export type AttemptResult = {
    playerId: string
    comparison: PlayerComparison
}

/**
 * Etat du jour renvoyé au client. `playerOfTheDay` n'est renseigné qu'une fois la partie
 * gagnée : tant qu'elle est en cours, le client n'a que les indices, jamais la réponse.
 */
export type M8dleStatus = {
    success: boolean
    attempts: AttemptResult[]
    playerOfTheDay: Player | null
}

/** Réponse à une tentative : mêmes règles de révélation que M8dleStatus. */
export type AttemptResponse = {
    success: boolean
    comparison: PlayerComparison
    playerOfTheDay: Player | null
}
