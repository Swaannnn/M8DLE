'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAuth() {
    const { data, error, isLoading, mutate } = useSWR('/api/auth/me', fetcher)
    const router = useRouter()

    const user = data?.user
    const loading = isLoading
    const loggedOut = error || !user

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        mutate(null, false)
        router.push('/')
        router.refresh()
    }

    return {
        user,
        loading,
        loggedOut,
        logout,
        mutate,
    }
}
