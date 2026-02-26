import { JsonValue } from '@prisma/client/runtime/client'

export type UserStatus = {
    hasWin: boolean
    attempts: JsonValue
}
