import countriesLib from 'i18n-iso-countries'
import frLocale from 'i18n-iso-countries/langs/fr.json'

countriesLib.registerLocale(frLocale)

const baseCountries = countriesLib.getNames('fr')

export const countries = Object.entries(baseCountries)
    .map(([value, label]) => ({ value: value.toString(), label: label.toString() }))
    .sort((a, b) => a.label.localeCompare(b.label))
