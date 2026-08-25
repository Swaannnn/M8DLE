import { ApiError } from '@/utils/apiError'

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init)

    if (!res.ok) {
        // Les routes API renvoient { error: string } en cas d'échec (voir NextResponse.json({ error: ... })).
        // On récupère ce message pour l'afficher tel quel (toast / message inline) plutôt que le statusText générique.
        let message: string = res.statusText
        try {
            const body = await res.json()
            if (typeof body?.error === 'string') {
                message = body.error
            }
        } catch {
            // Corps de réponse absent ou non-JSON : on garde le statusText
        }

        throw new ApiError(res.status, message)
    }

    return res.json()
}
