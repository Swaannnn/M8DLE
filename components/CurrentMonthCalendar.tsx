'use client'

import { grey, lightGrey, pink } from '@/constants/colors'
import { AbsoluteCenter, Box, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react'
import { useColorMode } from './ui/color-mode'
import { getDaysOfMonth, getFirstDayOfMonth } from '@/utils/dateUtils'
import { useTranslations } from 'next-intl'
import { Tooltip } from './ui/tooltip'
import { DailyM8DLEResultWithAttemptsCount } from '@/types/m8dleResults'

const CurrentMonthCalendar = ({ results, loading, date }: { results: DailyM8DLEResultWithAttemptsCount[], loading: boolean, date: Date }) => {
    const { colorMode } = useColorMode()
    const t = useTranslations('calendar')

    if (loading) {
        return (
            <Spinner size="xl" />
        )
    }

    const firstDay = getFirstDayOfMonth(date).getDay()
    const startOffset = (firstDay + 6) % 7
    const days = getDaysOfMonth(date)
    const invalidGrey = colorMode === 'light' ? lightGrey : grey
    const daysOfWeek = t.raw('days') as string[]
    const map = new Map<number, DailyM8DLEResultWithAttemptsCount | null>()

    for (let i = 0; i < getDaysOfMonth(date); i++) {
        map.set(i, results.find((r) => new Date(r.date).getDate() === i) ?? null)
    }

    return (
        <Grid
            templateColumns="repeat(7, 1fr)"
            gap={2}
        >
            {daysOfWeek.map((day, index) => (
                <GridItem
                    key={index}
                    borderRadius="md"
                    p={2}
                    border={`1px solid ${invalidGrey}`}
                >
                    <Text textAlign="center">{day}</Text>
                </GridItem>
            ))}

            {Array.from({ length: startOffset }).map((_, index) => (
                <GridItem key={`empty-${index}`} />
            ))}

            {Array.from({ length: days }).map((_, index) => {
                const day = index + 1
                const result = map.get(day)
                const isVictory = result?.success ?? false
                const attemptsCount = result?._count.attempts ?? 0

                const cell = (
                    <Box
                        textAlign="center"
                        borderRadius="md"
                        p={2}
                        bg={isVictory ? pink : invalidGrey}
                        color={isVictory ? 'black' : 'white'}
                        cursor={isVictory ? 'pointer' : 'default'}
                    >
                        {day}
                    </Box>
                )

                if (!isVictory) {
                    return <GridItem key={day}>{cell}</GridItem>
                }

                return (
                    <GridItem key={day}>
                        <Tooltip
                            content={`${attemptsCount} ${attemptsCount > 1 ? t('tries') : t('try') }`}
                            openDelay={50}
                            closeDelay={100}
                            showArrow
                        >
                            {cell}
                        </Tooltip>
                    </GridItem>
                )
            })}
        </Grid>
    )
}

export default CurrentMonthCalendar
