import { z } from 'zod'
import { OrganizationPlayerDto } from './CreatePlayerDto'

export const UpdatePlayerDto = z.object({
    id: z.string(),
    name: z.string().optional(),
    birthDate: z.coerce.date().optional(),
    imageUrl: z.string().optional(),
    nationality: z.string().length(2).optional(),
    gameId: z.string().nullable().optional(),
    organizationPlayers: z.array(OrganizationPlayerDto).optional(),
})
