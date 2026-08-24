/**
 * Format de stockage local (invité, non connecté) du statut M8DLE dans le localStorage.
 * Volontairement distinct du modèle Prisma `DailyM8DLEResult` : ici `attempts` n'est
 * qu'une liste d'IDs de joueurs, pas des `Attempt` complets.
 */
export type M8dleStatus = {
    attempts: string[]
    success: boolean
    date?: Date
}
