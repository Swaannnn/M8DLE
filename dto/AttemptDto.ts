import { z } from 'zod'

const AttemptDto = z.object({
    attempts: z.array(z.string()),
    isWin: z.boolean(),
})

export { AttemptDto }
