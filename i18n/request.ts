import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

const SUPPORTED_LOCALES = ['en', 'fr']
const DEFAULT_LOCALE = 'en'

export default getRequestConfig(async () => {
    const cookieStore = await cookies()
    const headerStore = await headers()

    const cookieLocale = cookieStore.get('locale')?.value

    if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
        return {
            locale: cookieLocale,
            messages: (await import(`../messages/${cookieLocale}.json`)).default,
        }
    }

    const acceptLanguage = headerStore.get('accept-language')

    if (acceptLanguage) {
        const browserLocale = acceptLanguage.split(',')[0].split('-')[0]

        if (SUPPORTED_LOCALES.includes(browserLocale)) {
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
