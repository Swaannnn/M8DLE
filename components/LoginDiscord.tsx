import { Button, Text } from '@chakra-ui/react'
import DiscordIcon from './icons/DiscordIcon'
import NextLink from 'next/link'
import { useColorMode } from './ui/color-mode'
import { useTranslations } from 'next-intl'

const LoginDiscord = () => {
    const { colorMode } = useColorMode()
    const t = useTranslations('loginDiscord')

    return (
        <>
            <Text>{t('text')}</Text>
            <Button asChild>
                <NextLink href="/api/auth/login">
                    <DiscordIcon color={colorMode === 'light' ? 'white' : 'black'} />
                    {t('button')}
                </NextLink>
            </Button>
        </>
    )
}

export default LoginDiscord
