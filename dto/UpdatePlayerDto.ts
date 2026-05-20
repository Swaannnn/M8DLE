import { z } from 'zod'

const UpdatePlayerDto = z.object({
    id: z.string(),
    name: z.string().optional(),
    birthDate: z.date().optional(),
    imageUrl: z.string().optional(),
})

export { UpdatePlayerDto }
