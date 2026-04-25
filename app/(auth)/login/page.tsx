'use client'

import { Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'
import accountPreview from '@/public/images/account_preview.png'
import Image from 'next/image'
import LoginDiscord from '@/components/LoginDiscord'

const tuskerGrotesk = localFont({
    src: '../../fonts/TuskerGrotesk-4800Super.woff2',
})

const LoginPage = () => {
    return (
        <VStack
            gap="1rem"
            w="90vw"
            mx="auto"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
            >
                CONNEXION
            </Text>
            <LoginDiscord />
            <Image
                src={accountPreview}
                alt="Account preview"
                width={400}
                height={300}
            />
        </VStack>
    )
}

export default LoginPage
