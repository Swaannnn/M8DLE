import { z } from 'zod'

const AttemptDto = z.object({
    playerName: z.string(),
    isWin: z.boolean(),
    hasWin: z.boolean().optional(),
    attempts: z.array(z.string()).default([]),
})

export { AttemptDto }
