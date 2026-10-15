import countriesLib from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import frLocale from 'i18n-iso-countries/langs/fr.json'
import { useLocale } from 'next-intl'

countriesLib.registerLocale(frLocale)
countriesLib.registerLocale(enLocale)

export type Country = { value: string; label: string }

/**
 * Environ 250 entrées à construire puis trier. Le résultat est gardé par locale : la liste
 * est passée telle quelle en prop à SearchableSelect, dont les `useMemo` dépendent de son
 * identité — la recalculer à chaque rendu les invaliderait tous.
 *
 * Les tableaux renvoyés sont partagés entre appelants : à lire, jamais à muter.
 */
const countriesByLocale = new Map<string, Country[]>()

export function getCountries(locale: string = 'en'): Country[] {
    const cached = countriesByLocale.get(locale)
    if (cached) return cached

    const baseCountries = countriesLib.getNames(locale) || countriesLib.getNames('en') || {}

    const countries = Object.entries(baseCountries)
        .map(([value, label]) => ({ value: value.toString(), label: label.toString() }))
        // Sans locale explicite, le tri suit celle du runtime : « Îles Caïmans » finirait
        // après « Zimbabwe » côté serveur mais pas côté navigateur.
        .sort((a, b) => a.label.localeCompare(b.label, locale))

    countriesByLocale.set(locale, countries)

    return countries
}

export function useCountries(): Country[] {
    return getCountries(useLocale())
}
