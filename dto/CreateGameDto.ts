import { z } from 'zod'

export const CreateGameDto = z.object({
    name: z.string().min(1),
    imageUrl: z.string(),
})
