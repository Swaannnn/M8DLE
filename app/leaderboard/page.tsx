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
import { LeaderboardData, LeaderboardUser } from '@/types/leaderboard'
import { ApiError } from 'next/dist/server/api-utils'
import { ApiErrorContainer } from '@/components/ApiErrorContainer'
import constantsParams from '@/constants/constantsParams'
import { getProfileAvatar } from '@/utils/userUtils'
import { useSearchParams } from 'next/navigation'
import { getNumberParamFromUrl } from '@/utils/requestUtils'

const tuskerGrotesk = localFont({
    src: '../fonts/TuskerGrotesk-4800Super.woff2',
})

const LeaderboardRow = ({ item, index, page }: { item: LeaderboardUser; index: number; page: number }) => {
    let avatarUrl = getProfileAvatar(item)

    return (
        <Table.Row>
            <Table.Cell>{(page - 1) * constantsParams.LEADERBOARD_PAGE_SIZE + index + 1}.</Table.Cell>
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
    const { data, error, isLoading } = useSWR<LeaderboardData, ApiError>(`/api/m8dle/leaderboard?page=${page}`, fetcher)
    const isMobile = useBreakpointValue({ base: true, md: false })
    const OnPaginationClick = (page: number) => {
        setPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

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

    const users = data?.users ?? []
    const total = data?.total ?? 0

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
                    {users.map((item, index) => (
                        <LeaderboardRow
                            key={item.id}
                            item={item}
                            index={index}
                            page={page}
                        />
                    ))}
                </Table.Body>
            </Table.Root>
            {total > constantsParams.LEADERBOARD_PAGE_SIZE && (
                <Pagination.Root
                    count={total}
                    pageSize={constantsParams.LEADERBOARD_PAGE_SIZE}
                    page={page}
                >
                    <ButtonGroup
                        variant="ghost"
                        size="sm"
                        wrap="wrap"
                    >
                        <Pagination.PrevTrigger asChild>
                            <IconButton onClick={() => OnPaginationClick(Math.max(page - 1, 1))}>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(paginationPage) => (
                                <IconButton
                                    variant={{ base: 'ghost', _selected: 'outline' }}
                                    onClick={() => OnPaginationClick(paginationPage.value)}
                                >
                                    {paginationPage.value}
                                </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton onClick={() => OnPaginationClick(page + 1)}>
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
