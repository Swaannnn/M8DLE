import { z } from 'zod'

const AttemptDto = z.object({
    attempt: z.string(),
})

export { AttemptDto }
