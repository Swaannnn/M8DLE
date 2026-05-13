import { describe, it, expect, vi } from 'vitest'
import { GET } from '@/app/api/users/route'
import { prisma } from '@/__mocks__/db'

vi.mock('@/lib/db', () => import('@/__mocks__/db'))

describe('GET /api/users', () => {
    it("doit retourner une liste d'utilisateurs avec un statut 200", async () => {
        const mockUsers = [
            {
                id: 'user1',
                discordId: '123456789',
                username: 'TestUser',
                avatar: null,
                email: 'test@test.com',
                role: 'USER',
                totalWins: 0,
                totalAttempts: 0,
                averageAttempts: 0,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]

        prisma.user.findMany.mockResolvedValue(mockUsers as any)

        const response = await GET()
        const data = await response.json()

        expect(prisma.user.findMany).toHaveBeenCalledTimes(1)
        expect(response.status).toBe(200)
        expect(data).toHaveLength(1)
        expect(data[0].username).toBe('TestUser')
    })

    it('doit retourner une erreur 500 si la base de données échoue', async () => {
        prisma.user.findMany.mockRejectedValue(new Error('Erreur de connexion BD'))

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data).toEqual({ error: 'Failed to fetch users' })
    })
})
