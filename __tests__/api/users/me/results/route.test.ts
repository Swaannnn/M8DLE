import { describe, it, expect, vi } from 'vitest'
import { GET } from '@/app/api/users/me/results/route'
import * as session from '@/lib/auth/session'
import { prisma } from '@/__mocks__/db'

vi.mock('@/lib/db', () => import('@/__mocks__/db'))

const mockSessionValue = { userId: "123456789", discordId: "123456789", expiresAt: new Date(), role: "USER" }

// évite le problème du "import 'server-only'" dans "@/lib/auth/session"
vi.mock('server-only', () => {
    return {};
});

describe('GET /api/users/me/results', () => {
    it('doit retourner une erreur 401 non authorisé', async () => {
        const spy = vi.spyOn(session, 'getSession')
        spy.mockResolvedValue(null)

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(401)
        expect(data).toEqual({ error: 'Accès non-autorisé' })
        expect(spy).toHaveBeenCalledOnce()
        spy.mockClear()
    })

    it('doit retourner une liste vide', async () => {
        const spy = vi.spyOn(session, 'getSession')
        spy.mockResolvedValue(mockSessionValue)
        prisma.dailyM8DLEResult.findMany.mockResolvedValue([])

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data).toHaveLength(0)
        expect(spy).toHaveBeenCalledOnce()
        spy.mockClear()
    })

    it('doit retourner une erreur 500 si la base de données échoue', async () => {
        const spy = vi.spyOn(session, 'getSession')
        spy.mockResolvedValue(mockSessionValue)
        prisma.dailyM8DLEResult.findMany.mockRejectedValue(new Error('Erreur de connexion BD'))

        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data).toEqual({ error: 'Erreur lors de la récupération des résultats' })
        expect(spy).toHaveBeenCalledOnce()
        spy.mockClear()
    })
})
