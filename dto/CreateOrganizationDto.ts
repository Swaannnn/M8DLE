import { z } from 'zod'

export const CreateOrganizationDto = z.object({
    name: z.string().min(1),
    imageUrl: z.string(),
})
