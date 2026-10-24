import { Prisma } from '@prisma/client'

/** Relations à charger pour qu'un joueur soit comparable et affichable. */
export const playerWithRelationsInclude = {
    game: true,
    organizationPlayers: {
        include: { organization: true },
        orderBy: { start: 'asc' },
    },
} satisfies Prisma.PlayerInclude

export type PlayerWithRelations = Prisma.PlayerGetPayload<{
    include: {
        game: true
        organizationPlayers: {
            include: {
                organization: true
            }
        }
    }
}>

export type Player = PlayerWithRelations
