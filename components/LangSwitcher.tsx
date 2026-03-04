import { getLocale, setLocale } from '@/utils/localeUtils'
import { Button, IconButton } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LangSwitcher = () => {
    const router = useRouter()

    const [currentLocale, setCurrentLocale] = useState('en')

    const changeLanguage = async (locale: string) => {
        await setLocale(locale)
        setCurrentLocale(locale)
        router.refresh()
    }

    useEffect(() => {
        const getCurrentLocale = async () => {
            const locale = await getLocale()
            setCurrentLocale(locale)
        }
        getCurrentLocale()
    }, [])

    return (
        <IconButton
            variant="ghost"
            size="sm"
            aria-label="lang switcher button"
            onClick={() => changeLanguage(currentLocale === 'en' ? 'fr' : 'en')}
        >
            {currentLocale === 'fr' ? 'FR' : 'EN'}
        </IconButton>
    )
}

export default LangSwitcher
