import 'server-only'

import { prisma } from '@/lib/db'
import { playerWithRelationsInclude, type Player } from '@/types/player'

/**
 * Durée de vie du catalogue en mémoire. Les routes admin invalident le cache de leur instance ;
 * c'est le délai maximal avant qu'une modification soit visible sur les autres.
 */
const CATALOGUE_TTL_MS = 60_000

/** Délai minimal entre deux relectures provoquées par un id absent, pour qu'un id inconnu ne relise pas la base à chaque requête. */
const MISSING_PLAYER_RELOAD_INTERVAL_MS = 5_000

/** La promesse est mise en cache, pas son résultat : des requêtes simultanées partagent la même lecture. */
let catalogue: { loadedAt: number; players: Promise<Map<string, Player>> } | null = null

/** Catalogue des joueurs avec leurs relations, indexé et trié par id. */
export function getCatalogue(): Promise<Map<string, Player>> {
    if (!catalogue || Date.now() - catalogue.loadedAt > CATALOGUE_TTL_MS) {
        const players = prisma.player
            .findMany({ include: playerWithRelationsInclude, orderBy: { id: 'asc' } })
            .then((list) => new Map(list.map((player) => [player.id, player])))
        const entry = { loadedAt: Date.now(), players }

        catalogue = entry
        // Un échec ne reste pas en cache : la requête suivante relira la base.
        players.catch(() => {
            if (catalogue === entry) catalogue = null
        })
    }

    return catalogue.players
}

/**
 * Catalogue contenant les ids demandés s'ils existent : un joueur absent peut avoir été ajouté
 * depuis le dernier chargement, on relit alors la base.
 */
export async function getCatalogueWith(ids: string[]): Promise<Map<string, Player>> {
    const players = await getCatalogue()
    if (ids.every((id) => players.has(id))) return players

    const canReload = !catalogue || Date.now() - catalogue.loadedAt > MISSING_PLAYER_RELOAD_INTERVAL_MS
    if (!canReload) return players

    invalidateCatalogue()
    return getCatalogue()
}

/** À appeler après toute écriture qui modifie un joueur, son jeu ou ses organisations. */
export function invalidateCatalogue() {
    catalogue = null
}
