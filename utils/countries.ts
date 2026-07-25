import countriesLib from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import frLocale from 'i18n-iso-countries/langs/fr.json'
import { useLocale } from 'next-intl'

countriesLib.registerLocale(frLocale)
countriesLib.registerLocale(enLocale)

export function getCountries(locale: string = 'en') {
    const baseCountries = countriesLib.getNames(locale) || countriesLib.getNames('en') || {}

    return Object.entries(baseCountries)
        .map(([value, label]) => ({ value: value.toString(), label: label.toString() }))
        .sort((a, b) => a.label.localeCompare(b.label))
}

export function useCountries() {
    const locale = useLocale()
    return getCountries(locale)
}

