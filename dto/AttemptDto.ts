import { z } from 'zod'

const AttemptDto = z.object({
    attempt: z.string(),
})

const MultipleAttemptDto = z.object({
    attempts: z.array(z.string()).min(1),
})

export { AttemptDto, MultipleAttemptDto }
