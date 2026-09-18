'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { fetcher, ApiError } from '@/utils/apiClient'
import { UserProfile } from '@/types/userProfile'

export function useAuth() {
    const { data, error, isLoading, mutate } = useSWR<UserProfile | null, ApiError>('/api/auth/me', fetcher)
    const router = useRouter()

    const user = data ?? null
    const loading = isLoading
    const loggedOut = Boolean(error) || !user

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
