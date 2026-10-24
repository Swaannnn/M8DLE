import { Player } from '@/types/player'

export function filterPlayersNotInAttempts(allPlayers: Player[], attempts: string[]): Player[] {
    if (!attempts || attempts.length === 0) return allPlayers

    const attemptedIds = new Set(attempts)
    return allPlayers.filter((p) => !attemptedIds.has(p.id))
}
