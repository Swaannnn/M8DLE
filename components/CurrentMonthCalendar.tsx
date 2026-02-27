'use client'

import { grey, lightGrey, pink } from '@/constants/colors'
import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import { useColorMode } from './ui/color-mode'
import { DailyM8DLEResult } from '@prisma/client'
import { getDaysOfMonth, getFirstDayOfMonth } from '@/utils/dateUtils'

const daysKeys = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const CurrentMonthCalendar = ({ results }: { results: DailyM8DLEResult[] }) => {
    const { colorMode } = useColorMode()
    const now = new Date()
    const monthName = now.toLocaleString('fr-FR', { month: 'long' })
    const year = now.getFullYear()
    const firstDay = getFirstDayOfMonth(now).getDay()
    const startOffset = (firstDay + 6) % 7
    const days = getDaysOfMonth(now)
    const invalidGrey = colorMode === 'light' ? lightGrey : grey
    const map = new Map<number, DailyM8DLEResult | null>()

    days.forEach((day) => {
        map.set(day, results.find((r) => new Date(r.date).getDate() === day) ?? null)
    })

    return (
        <VStack gap={4}>
            <VStack>
                <Text>
                    Tes victoires en {monthName} {year}
                </Text>
            </VStack>

            <Grid
                templateColumns="repeat(7, 1fr)"
                gap={2}
            >
                {daysKeys.map((day, index) => (
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

                {days.map((day) => {
                    const result = map.get(day)
                    return (
                        <GridItem key={day}>
                            <Box
                                textAlign="center"
                                borderRadius="md"
                                p={2}
                                bg={result?.success ? pink : invalidGrey}
                                color={result?.success ? 'black' : 'white'}
                            >
                                {day}
                            </Box>
                        </GridItem>
                    )
                })}
            </Grid>
        </VStack>
    )
}

export default CurrentMonthCalendar
