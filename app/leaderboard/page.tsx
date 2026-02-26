'use client'

import {
    AbsoluteCenter,
    ButtonGroup,
    HStack,
    IconButton,
    Image,
    Pagination,
    Spinner,
    Table,
    Text,
    useBreakpointValue,
    VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import localFont from 'next/font/local'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
import { LeaderboardData } from '@/types/leaderboard'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorContainer } from '@/components/ApiErrorContainer'
import constantsApi from '@/constants/constantsApi'
import defaultAvatar from '@/public/images/default_avatar.jpg'

const tuskerGrotesk = localFont({
    src: '../fonts/TuskerGrotesk-4800Super.woff2',
})

const LeaderboardRow = ({ item, index, page }: { item: LeaderboardData; index: number; page: number }) => {
    let avatarUrl: string
    if (item.avatar != '') {
        avatarUrl = `${constantsApi.AVATAR}/${item.discordId}/${item.avatar}.png`
    } else {
        avatarUrl = defaultAvatar.src
    }

    return (
        <Table.Row>
            <Table.Cell>{(page - 1) * 20 + index + 1}.</Table.Cell>
            <Table.Cell>
                <HStack gap={2}>
                    <Image
                        src={avatarUrl}
                        alt="user avatar"
                        width={8}
                        height={8}
                        borderRadius="999px"
                    />
                    {item.username}
                </HStack>
            </Table.Cell>
            <Table.Cell textAlign="center">{item.wins}</Table.Cell>
            <Table.Cell textAlign="center">{item.averageAttempts}</Table.Cell>
        </Table.Row>
    )
}

const Leaderboard = () => {
    const [page, setPage] = useState(1)
    const {
        data: leaderboardData = [],
        error,
        isLoading,
    } = useSWR<LeaderboardData[], ApiError>('/api/m8dle/leaderboard', fetcher)
    const isMobile = useBreakpointValue({ base: true, md: false })

    if (isLoading) {
        return (
            <AbsoluteCenter>
                <Spinner
                    marginTop="3rem"
                    size="xl"
                />
            </AbsoluteCenter>
        )
    }

    if (error) {
        return <ApiErrorContainer error={error} />
    }

    return (
        <VStack
            w="90vw"
            maxW="1200px"
            mx="auto"
            gap="1rem"
        >
            <Text
                as="h1"
                fontSize={{ base: '2.5rem', md: '4rem' }}
                className={tuskerGrotesk.className}
            >
                CLASSEMENT
            </Text>
            <Text>Classement global des joueurs connectés.</Text>
            <Table.Root
                size="sm"
                variant="outline"
                interactive
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader></Table.ColumnHeader>
                        <Table.ColumnHeader>Joueur</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Victoire</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                            {isMobile ? 'Nb essais' : "Nombre d'essais moyen"}
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {leaderboardData.slice((page - 1) * 20, page * 20).map((item, index) => (
                        <LeaderboardRow
                            key={item.id}
                            item={item}
                            index={index}
                            page={page}
                        />
                    ))}
                </Table.Body>
            </Table.Root>
            {leaderboardData.length > 20 && (
                <Pagination.Root
                    count={leaderboardData.length}
                    pageSize={20}
                    page={page}
                >
                    <ButtonGroup
                        variant="ghost"
                        size="sm"
                        wrap="wrap"
                    >
                        <Pagination.PrevTrigger asChild>
                            <IconButton
                                onClick={() => {
                                    setPage((prev) => Math.max(prev - 1, 1))
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                            >
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                                <IconButton
                                    variant={{ base: 'ghost', _selected: 'outline' }}
                                    onClick={() => {
                                        setPage((prev) => Math.min(prev + 1, Math.ceil(leaderboardData.length / 20)))
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}
                                >
                                    {page.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton
                                onClick={() => {
                                    setPage((prev) => prev + 1)
                                    window.scrollTo({ top: 0, behavior: 'smooth' })
                                }}
                            >
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            )}
        </VStack>
    )
}

export default Leaderboard
