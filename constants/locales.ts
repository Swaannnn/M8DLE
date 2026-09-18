export const SUPPORTED_LOCALES = ['en', 'fr'] as const

export const DEFAULT_LOCALE = 'en'

export const LOCALE_COOKIE_NAME = 'locale'

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const isSupportedLocale = (locale: string): locale is Locale => SUPPORTED_LOCALES.includes(locale as Locale)
