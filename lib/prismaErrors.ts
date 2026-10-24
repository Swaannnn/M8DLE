import { Prisma } from '@prisma/client'

/** https://www.prisma.io/docs/orm/reference/error-reference */
const UNIQUE_CONSTRAINT_VIOLATION = 'P2002'

/** Écriture rejetée par une contrainte unique (typiquement une écriture concurrente). */
export const isUniqueConstraintViolation = (error: unknown): boolean =>
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === UNIQUE_CONSTRAINT_VIOLATION
