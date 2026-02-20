'use client'

import { HStack, Link, Text } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'

const Footer = () => {
    const router = useRouter()

    return (
        <HStack
            width="100%"
            padding="1rem 10vw"
            justifyContent="space-between"
            position="fixed"
            bottom="0"
            bg="bg"
            zIndex="100"
            borderTopWidth="1px"
            borderColor="fg"
        >
            <Text>© 2026 M8DLE</Text>
            <Link onClick={() => router.push('/credits')}>Crédits</Link>
            <Link onClick={() => router.push('/privacy')}>Politique de confidentialité</Link>
            <Link onClick={() => router.push('/legal')}>Mentions légales</Link>
        </HStack>
    )
}

export default Footer
