'use client'

import { Heading, List, Stack, Text, VStack } from '@chakra-ui/react'
import localFont from 'next/font/local'
import Link from 'next/link'

const tuskerGrotesk = localFont({
    src: '../fonts/TuskerGrotesk-4800Super.woff2',
})

const Credits = () => (
    <VStack
        w={{ base: '90vw', md: '50vw' }}
        mx="auto"
        gap="1rem"
    >
        <Text
            as="h1"
            fontSize={{ base: '2.5rem', md: '4rem' }}
            className={tuskerGrotesk.className}
            textAlign="center"
        >
            CRÉDITS
        </Text>
        <Stack gap="2rem">
            <Stack>
                <Heading size="lg">1. Développement & conception</Heading>
                <List.Root>
                    <List.Item>
                        Swann Gillé - Conception, développement, design graphique, interface utilisateur.
                    </List.Item>
                    <List.Item>
                        Front-end / React / Next.js - Création de l&apos;interface et de la logique du site.
                    </List.Item>
                    <List.Item>Back-end / Neon / Vercel - Hébergement et base de données.</List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">2. Polices & design graphique</Heading>
                <List.Root>
                    <List.Item>
                        Police utilisée pour le site : Tusker Grotesk pour les titres, Inter pour le reste du texte.
                    </List.Item>
                    <List.Item>
                        Icônes :{' '}
                        <Link
                            href="https://lucide.dev/icons/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Site des icônes Lucide"
                        >
                            Lucide
                        </Link>
                        .
                    </List.Item>
                </List.Root>
            </Stack>
            <Stack>
                <Heading size="lg">3. Technologies utilisées</Heading>
                <List.Root>
                    <List.Item>Next.js 16.1 en TypeScript</List.Item>
                    <List.Item>Chakra UI pour les composants UI</List.Item>
                    <List.Item>Lucide React pour les icônes</List.Item>
                    <List.Item>Vercel pour l&apos;hébergement du site</List.Item>
                    <List.Item>Neon pour la base de données</List.Item>
                </List.Root>
            </Stack>
        </Stack>
    </VStack>
)

export default Credits
