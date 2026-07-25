import { DatePicker, Portal, IconButton, Text, HStack, Box, parseDate } from '@chakra-ui/react'
import { LuCalendar, LuChevronLeft, LuChevronRight } from 'react-icons/lu'

export type CustomDatePickerProps = {
    value?: string | null
    onChange: (value: string) => void
    required?: boolean
    width?: any
}

export function CustomDatePicker({ value, onChange, required, width = 'full' }: CustomDatePickerProps) {
    return (
        <Box width={width}>
            <DatePicker.Root
                positioning={{ sameWidth: true }}
                value={value ? [parseDate(new Date(value).toISOString().split('T')[0])] : []}
                onValueChange={(details) => onChange(details.valueAsString[0] || '')}
                format={(date) => {
                    const yyyy = date.year
                    const mm = String(date.month).padStart(2, '0')
                    const dd = String(date.day).padStart(2, '0')
                    return `${yyyy}-${mm}-${dd}`
                }}
            >
                <DatePicker.Control display="flex" w="full" position="relative">
                    <DatePicker.Input
                        required={required}
                        bg="bg.panel"
                        borderWidth="1px"
                        borderRadius="md"
                        px="3"
                        py="2"
                        w="full"
                        cursor="pointer"
                    />
                    <DatePicker.IndicatorGroup position="absolute" right="2" top="50%" transform="translateY(-50%)">
                        <DatePicker.Trigger asChild>
                            <IconButton variant="ghost" size="xs">
                                <LuCalendar />
                            </IconButton>
                        </DatePicker.Trigger>
                    </DatePicker.IndicatorGroup>
                </DatePicker.Control>
                <Portal>
                    <DatePicker.Positioner zIndex={1400}>
                        <DatePicker.Content bg="bg.panel" p="4" borderRadius="md" boxShadow="lg" borderWidth="1px">
                            <DatePicker.View view="day">
                                <DatePicker.Context>
                                    {(datePicker) => (
                                        <>
                                            <DatePicker.Header mb="2">
                                                <HStack justify="space-between" w="full">
                                                    <DatePicker.PrevTrigger asChild>
                                                        <IconButton variant="ghost" size="sm"><LuChevronLeft /></IconButton>
                                                    </DatePicker.PrevTrigger>
                                                    <Text fontWeight="bold">{datePicker.visibleRangeText.start}</Text>
                                                    <DatePicker.NextTrigger asChild>
                                                        <IconButton variant="ghost" size="sm"><LuChevronRight /></IconButton>
                                                    </DatePicker.NextTrigger>
                                                </HStack>
                                            </DatePicker.Header>
                                            <DatePicker.Table w="full" style={{ borderCollapse: 'collapse' }}>
                                                <DatePicker.TableHead>
                                                    <DatePicker.TableRow>
                                                        {datePicker.weekDays.map((weekDay, id) => (
                                                            <DatePicker.TableHeader key={id} textAlign="center" pb="2">
                                                                <Text fontSize="sm" color="gray.500">{weekDay.short}</Text>
                                                            </DatePicker.TableHeader>
                                                        ))}
                                                    </DatePicker.TableRow>
                                                </DatePicker.TableHead>
                                                <DatePicker.TableBody>
                                                    {datePicker.weeks.map((week, id) => (
                                                        <DatePicker.TableRow key={id}>
                                                            {week.map((day, id) => (
                                                                <DatePicker.TableCell key={id} value={day} p="1">
                                                                    <DatePicker.TableCellTrigger asChild>
                                                                        <IconButton 
                                                                            variant="ghost" 
                                                                            size="sm"
                                                                            w="100%"
                                                                            _selected={{ bg: 'white', color: 'black', _hover: { bg: 'gray.200' } }}
                                                                        >
                                                                            {day.day}
                                                                        </IconButton>
                                                                    </DatePicker.TableCellTrigger>
                                                                </DatePicker.TableCell>
                                                            ))}
                                                        </DatePicker.TableRow>
                                                    ))}
                                                </DatePicker.TableBody>
                                            </DatePicker.Table>
                                        </>
                                    )}
                                </DatePicker.Context>
                            </DatePicker.View>
                        </DatePicker.Content>
                    </DatePicker.Positioner>
                </Portal>
            </DatePicker.Root>
        </Box>
    )
}
