import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Réutilisé entre deux rechargements à chaud en dev, sinon chacun ouvrirait de nouvelles connexions.
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
