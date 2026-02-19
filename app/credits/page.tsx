'use client'

import { Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'

const tuskerGrotesk = localFont({
    src: '../fonts/TuskerGrotesk-4800Super.woff2',
})

const Credits = () => {
    return (
        <VStack
            width="90vw"
            mx="auto"
            gap="1rem"
        >
            <Text
                fontSize="4rem"
                className={tuskerGrotesk.className}
            >
                CRÉDITS
            </Text>
            <Text>TODO</Text>
        </VStack>
    )
}

export default Credits
