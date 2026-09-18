import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isSupportedLocale } from '@/constants/locales'

export default getRequestConfig(async () => {
    const cookieStore = await cookies()
    const headerStore = await headers()

    const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value

    if (cookieLocale && isSupportedLocale(cookieLocale)) {
        return {
            locale: cookieLocale,
            messages: (await import(`../messages/${cookieLocale}.json`)).default,
        }
    }

    const acceptLanguage = headerStore.get('accept-language')

    if (acceptLanguage) {
        const browserLocale = acceptLanguage.split(',')[0].split('-')[0]

        if (isSupportedLocale(browserLocale)) {
            return {
                locale: browserLocale,
                messages: (await import(`../messages/${browserLocale}.json`)).default,
            }
        }
    }

    return {
        locale: DEFAULT_LOCALE,
        messages: (await import(`../messages/${DEFAULT_LOCALE}.json`)).default,
    }
})
