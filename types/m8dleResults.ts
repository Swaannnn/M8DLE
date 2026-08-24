import { DailyM8DLEResult } from '@prisma/client'

export type DailyM8DLEResultWithAttemptsCount = DailyM8DLEResult & {
    _count: {
        attempts: number
    }
}
