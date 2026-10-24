import { z } from 'zod'
import { Role } from '@prisma/client'

export const UpdateUserDto = z.object({
    id: z.string(),
    username: z.string().min(1).optional(),
    email: z.string().nullable().optional(),
    role: z.enum([Role.USER, Role.ADMIN]).optional(),
})
