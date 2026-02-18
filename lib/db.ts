import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import 'server-only'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! })

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
