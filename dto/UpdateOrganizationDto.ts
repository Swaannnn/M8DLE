import { z } from 'zod'

export const UpdateOrganizationDto = z.object({
    id: z.string(),
    name: z.string().min(1).optional(),
    imageUrl: z.string().optional(),
})
