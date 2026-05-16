import { describe, it, expect, vi } from 'vitest'
import * as handlers from '@/app/api/users/[id]/route'
import { prisma } from '@/__mocks__/db'
import { NextRequest } from 'next/server'

vi.mock('@/lib/db', () => import('@/__mocks__/db'))

describe('GET /api/users/[id]', () => {
    it("doit retourner un utilisateur avec un statut 200", async () => {
        const req = new NextRequest(new Request('https://test.com/api/users?id=user1'));
        const mockUser = {
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
        }

        prisma.user.findUnique.mockResolvedValue(mockUser as any)

        const response = await handlers.GET(req)
        const data = await response.json()

        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
        expect(response.status).toBe(200)
        expect(data.username).toBe(mockUser.username)
    })

    it('doit retourner une erreur 400 si le paramètre id est absent', async () => {
        const req = new NextRequest(new Request('https://test.com/app/api/users/'), {});

        const response = await handlers.GET(req)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data).toEqual({ error: 'Parameter "id" is required' })
    })

    it('doit rtourner une erreur 404 si le user n\'est pas trouvé', async () => {
        const req = new NextRequest(new Request('https://test.com/app/api/users?id=user1'), {});
        prisma.user.findUnique.mockResolvedValue(null)

        const response = await handlers.GET(req)
        const data = await response.json()

        expect(prisma.user.findUnique).toHaveBeenCalledTimes(1)
        expect(response.status).toBe(404)
        expect(data).toEqual({ error: 'User not found' })
    })
})

describe('PATCH /api/users/[id]', () => {
    it("doit retourner un utilisateur avec un statut 200", async () => {
        const req = new NextRequest(new Request('https://test.com/api/users?id=user1', {
            method: 'PATCH',
            body: JSON.stringify({ role: 'ADMIN' })
        }));

        const mockUpdatedUser = { id: 'user1', role: 'ADMIN', username: 'TestUser' };

        prisma.user.update.mockResolvedValue(mockUpdatedUser as any)

        const response = await handlers.PATCH(req)
        const data = await response.json()

        expect(prisma.user.update).toHaveBeenCalledTimes(1)
        expect(response.status).toBe(200)
        expect(data.username).toBe(mockUpdatedUser.username)
        expect(data.role).toBe(mockUpdatedUser.role)
    })

    it('doit retourner une erreur 400 si le paramètre id est absent', async () => {
        const req = new NextRequest(new Request('https://test.com/app/api/users/'), {});

        const response = await handlers.PATCH(req)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data).toEqual({ error: 'Parameter "id" is required' })
    })
})
