import { Button, Text } from '@chakra-ui/react'
import DiscordIcon from './icons/DiscordIcon'
import { useColorMode } from './ui/color-mode'
import { useTranslations } from 'next-intl'

const LoginDiscord = () => {
    const { colorMode } = useColorMode()
    const t = useTranslations('loginDiscord')

    return (
        <>
            <Text>{t('text')}</Text>
            <Button asChild>
                <a href="/api/auth/login">
                    <DiscordIcon color={colorMode === 'light' ? 'white' : 'black'} />
                    {t('button')}
                </a>
            </Button>
        </>
    )
}

export default LoginDiscord
