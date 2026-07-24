import { Prisma } from '@prisma/client'

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


