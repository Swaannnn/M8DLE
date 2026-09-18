'use server'

import { cookies } from 'next/headers'
import { LOCALE_COOKIE_NAME, isSupportedLocale } from '@/constants/locales'

/** Un an : le choix de langue doit survivre à la fermeture du navigateur. */
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export async function setLocale(locale: string) {
    // Server action : la valeur vient du client. Une locale inconnue serait de toute façon
    // ignorée à la lecture (voir i18n/request.ts), autant ne pas l'écrire.
    if (!isSupportedLocale(locale)) return

    const cookieStore = await cookies()

    cookieStore.set(LOCALE_COOKIE_NAME, locale, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })
}
