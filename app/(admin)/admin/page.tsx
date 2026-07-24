'use client'

import { useState } from 'react'
import { Box, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { tuskerGrotesk } from '@/utils/fontUtils'
import { PlayersTab } from '@/components/admin/players/PlayersTab'

const PLAYERS_TAB = 'PLAYERS_TAB'
const ORGANIZATIONS_TAB = 'ORGANIZATIONS_TAB'
const GAMES_TAB = 'GAMES_TAB'
const USERS_TAB = 'USERS_TAB'

export default function AdminPlayersPage() {
    const t = useTranslations('adminPlayers')

    const [activeTab, setActiveTab] = useState<string>(PLAYERS_TAB)

    return (
        <VStack w="90vw" maxW="1200px" mx="auto" gap="1rem" align="stretch" py={{ base: '1rem', md: '2rem' }}>
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
                mx="auto"
            >
                {t('title').toUpperCase()}
            </Text>

            <HStack mb="2rem" borderBottomWidth="1px" pb="1rem" overflowX="auto">
                <Button
                    variant={activeTab === PLAYERS_TAB ? 'solid' : 'ghost'}
                    onClick={() => setActiveTab(PLAYERS_TAB)}
                >
                    {t('playersTab')}
                </Button>
                <Button
                    variant={activeTab === ORGANIZATIONS_TAB ? 'solid' : 'ghost'}
                    onClick={() => setActiveTab(ORGANIZATIONS_TAB)}
                >
                    {t('organizationsTab')}
                </Button>
                <Button
                    variant={activeTab === GAMES_TAB ? 'solid' : 'ghost'}
                    onClick={() => setActiveTab(GAMES_TAB)}
                >
                    {t('gamesTab')}
                </Button>
                <Button
                    variant={activeTab === USERS_TAB ? 'solid' : 'ghost'}
                    onClick={() => setActiveTab(USERS_TAB)}
                >
                    {t('usersTab')}
                </Button>
            </HStack>

            {activeTab === PLAYERS_TAB && <PlayersTab />}

            {activeTab === ORGANIZATIONS_TAB && (
                <Box py="4rem" textAlign="center">
                    <Text color="gray.500">{t('orgNotAvailable')}</Text>
                </Box>
            )}

            {activeTab === GAMES_TAB && (
                <Box py="4rem" textAlign="center">
                    <Text color="gray.500">{t('gamesNotAvailable')}</Text>
                </Box>
            )}

            {activeTab === USERS_TAB && (
                <Box py="4rem" textAlign="center">
                    <Text color="gray.500">{t('usersNotAvailable')}</Text>
                </Box>
            )}
        </VStack>
    )
}
