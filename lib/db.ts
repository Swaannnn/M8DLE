import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

export const prisma = new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
