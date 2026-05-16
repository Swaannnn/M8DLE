import { setLocale } from '@/utils/localeUtils'
import { IconButton } from '@chakra-ui/react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

const LangSwitcher = () => {
    const router = useRouter()
    const locale = useLocale()

    const changeLanguage = async (locale: string) => {
        await setLocale(locale)
        router.refresh()
    }

    return (
        <IconButton
            variant="ghost"
            size="sm"
            aria-label="lang switcher button"
            onClick={() => changeLanguage(locale === 'en' ? 'fr' : 'en')}
        >
            {locale === 'fr' ? 'FR' : 'EN'}
        </IconButton>
    )
}

export default LangSwitcher
