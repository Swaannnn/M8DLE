import { ApiError } from 'next/dist/server/api-utils'

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url)

    if (!res.ok) {
        const body = await res.json()
        if (body instanceof ApiError) {
            throw body
        }

        throw new ApiError(res.status, res.statusText)
    }

    return res.json()
}
