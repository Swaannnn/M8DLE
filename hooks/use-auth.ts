'use client'

import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { fetcher } from '@/utils/fetcher'
import { UserProfile } from '@/types/userProfile'
import { ApiError } from 'next/dist/server/api-utils'

export function useAuth() {
    const { data, error, isLoading, mutate } = useSWR<UserProfile | null, ApiError>('/api/auth/me', fetcher)
    const router = useRouter()

    const user = data
    const loading = isLoading
    const loggedOut = error || !user

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        await mutate(null, false)
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
