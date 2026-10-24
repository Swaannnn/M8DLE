import { z } from 'zod'

export const OrganizationPlayerDto = z.object({
    id: z.string().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().nullable().optional(),
    organizationId: z.string(),
})

export const CreatePlayerDto = z.object({
    name: z.string().min(1),
    birthDate: z.coerce.date(),
    imageUrl: z.string(),
    nationality: z.string().length(2),
    gameId: z.string().nullable().optional(),
    organizationPlayers: z.array(OrganizationPlayerDto).optional(),
})
