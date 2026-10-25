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

    const endSession = async (endpoint: string) => {
        await fetch(endpoint, { method: 'POST' })
        mutate(null, false)
        router.push('/')
        router.refresh()
    }

    const logout = () => endSession('/api/auth/logout')
    const logoutAll = () => endSession('/api/auth/logout-all')

    return {
        user,
        loading,
        loggedOut,
        logout,
        logoutAll,
        mutate,
    }
}
