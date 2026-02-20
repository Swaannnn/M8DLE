'use client'

import { LeaderboardData } from '@/types/leaderboard'
import { Image, Table, Text, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import defaultAvatar from '@/public/images/default_avatar.jpg'
import localFont from 'next/font/local'

const tuskerGrotesk = localFont({
    src: '../fonts/TuskerGrotesk-4800Super.woff2',
})

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>([])

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const res = await fetch('/api/m8dle/leaderboard')
            const data = await res.json()
            setLeaderboardData(data)
        }
        fetchLeaderboard()
    }, [])

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
                CLASSEMENT
            </Text>
            <Text>Classement gloab des joueurs connectés.</Text>
            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>#</Table.ColumnHeader>
                        <Table.ColumnHeader>Joueur</Table.ColumnHeader>
                        <Table.ColumnHeader>Victoire</Table.ColumnHeader>
                        <Table.ColumnHeader>Nombre d&apos;essais moyen</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {leaderboardData.map((item, index) => {
                        const avatarUrl = item.avatar
                            ? `https://cdn.discordapp.com/avatars/${item.discordId}/${item.avatar}.png`
                            : defaultAvatar.src

                        return (
                            <Table.Row key={item.id}>
                                <Table.Cell>{index + 1}</Table.Cell>
                                <Table.Cell
                                    display="flex"
                                    gap={2}
                                >
                                    <Image
                                        src={avatarUrl}
                                        alt="user avatar"
                                        width={10}
                                        height={10}
                                        borderRadius="999px"
                                    />
                                    {item.username}
                                </Table.Cell>
                                <Table.Cell>{item.wins}</Table.Cell>
                                <Table.Cell>{item.averageAttempts}</Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>
        </VStack>
    )
}

export default Leaderboard
