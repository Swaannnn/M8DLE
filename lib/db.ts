import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const connectionString = process.env.DATABASE_URL!

/**
 * Neon (serverless, via WebSocket) si l'URL pointe vers Neon, sinon driver Postgres classique
 * (ex. base Postgres auto-hébergée sur Coolify). Forçable via DATABASE_DRIVER=neon|pg.
 */
function createAdapter() {
    const driver = process.env.DATABASE_DRIVER ?? (/\.neon\.tech/.test(connectionString) ? 'neon' : 'pg')
    return driver === 'neon' ? new PrismaNeon({ connectionString }) : new PrismaPg({ connectionString })
}

// Réutilisé entre deux rechargements à chaud en dev, sinon chacun ouvrirait de nouvelles connexions.
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
