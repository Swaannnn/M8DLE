import { Player } from '@/types/player'

export function filterPlayersNotInAttempts(allPlayers: Player[], attempts: string[]): Player[] {
    if (!attempts || attempts.length === 0) return allPlayers
    return allPlayers.filter((p) => !attempts.includes(p.id))
}
