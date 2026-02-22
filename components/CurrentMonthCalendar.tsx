'use client'

import { grey, lightGrey, pink } from '@/constants/colors'
import { Box, Grid, GridItem, Text, VStack } from '@chakra-ui/react'
import { useColorMode } from './ui/color-mode'
import { DailyResult } from '@/types/dailyResult'

const CurrentMonthCalendar = ({ datas }: { datas: DailyResult[] }) => {
    const { colorMode } = useColorMode()

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const monthName = now.toLocaleString('fr-FR', { month: 'long' })
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const startOffset = (firstDay + 6) % 7
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    const resultsMap = new Map<number, DailyResult>()
    datas.forEach((data) => {
        const resultDate = new Date(data.date)
        if (resultDate.getMonth() === month && resultDate.getFullYear() === year) {
            resultsMap.set(resultDate.getDate(), data)
        }
    })

    const invalidGrey = colorMode === 'light' ? lightGrey : grey

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
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
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
                    const result = resultsMap.get(day)
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
