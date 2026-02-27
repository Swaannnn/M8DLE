'use server'

import { cookies } from 'next/headers'

export async function getLocale() {
    const cookieStore = await cookies()
    const locale = cookieStore.get('locale')?.value || 'en'
    return locale
}

export async function setLocale(locale: string) {
    const cookieStore = await cookies()

    cookieStore.set('locale', locale, {
        path: '/',
    })
}
