import { useMemo, useState, useEffect } from 'react'
import { Combobox, createListCollection, Portal, Box } from '@chakra-ui/react'
import { LuCheck, LuChevronDown } from 'react-icons/lu'
import { useTranslations } from 'next-intl'

export type SearchableSelectProps = {
    value?: string | null
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    width?: any
}

export function SearchableSelect({ value, onChange, options, placeholder = 'Select...', width = 'full' }: SearchableSelectProps) {
    const t = useTranslations('ui')

    const selectedOption = useMemo(() => options.find(o => o.value === value), [options, value])

    const [inputValue, setInputValue] = useState(selectedOption?.label || '')
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!isOpen) {
            setInputValue(selectedOption?.label || '')
        }
    }, [selectedOption, isOpen])

    const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase()

    const filteredOptions = useMemo(() => {
        if (!inputValue) return options
        if (inputValue === selectedOption?.label) return options
        return options.filter(o => normalize(o.label).includes(normalize(inputValue)))
    }, [options, inputValue, selectedOption])

    const showDefaultOption = !inputValue || inputValue === selectedOption?.label

    const collection = useMemo(() => createListCollection({
        items: filteredOptions,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
    }), [filteredOptions])

    return (
        <Box width={width}>
            <Combobox.Root
                collection={collection}
                value={value ? [value] : []}
                onValueChange={(e) => onChange(e.value[0] || '')}
                inputValue={inputValue}
                onInputValueChange={(e) => setInputValue(e.inputValue)}
                open={isOpen}
                onOpenChange={(e) => setIsOpen(e.open)}
                positioning={{ sameWidth: true }}
            >
                <Combobox.Control position="relative" display="flex" w="full">
                    <Combobox.Input
                        placeholder={placeholder}
                        w="full"
                        px="3"
                        py="2"
                        borderRadius="md"
                        borderWidth="1px"
                    />
                    <Combobox.Trigger position="absolute" right="3" top="50%" transform="translateY(-50%)" bg="transparent" border="none" cursor="pointer" p="0" display="flex">
                        <LuChevronDown />
                    </Combobox.Trigger>
                </Combobox.Control>
                <Portal>
                    <Combobox.Positioner zIndex={1400}>
                        <Combobox.Content maxH="250px" overflowY="auto" bg="bg.panel" p="1" borderRadius="md" boxShadow="lg" borderWidth="1px">
                            <Combobox.List>
                                {showDefaultOption && (
                                    <Box
                                        cursor="pointer"
                                        px="3"
                                        py="2"
                                        borderRadius="sm"
                                        _hover={{ bg: 'whiteAlpha.200' }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            onChange('')
                                            setInputValue('')
                                            setIsOpen(false)
                                        }}
                                        onClick={() => {
                                            onChange('')
                                            setInputValue('')
                                            setIsOpen(false)
                                        }}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Box as="span">{placeholder}</Box>
                                        {!value && <LuCheck />}
                                    </Box>
                                )}
                                {filteredOptions.length === 0 && !showDefaultOption && (
                                    <Box p="2" textAlign="center" color="gray.500" fontSize="sm">{t('noResults')}</Box>
                                )}
                                {filteredOptions.map((item) => (
                                    <Combobox.Item key={item.value} item={item} cursor="pointer" px="3" py="2" borderRadius="sm" _hover={{ bg: 'whiteAlpha.200' }}>
                                        <Combobox.ItemText>{item.label}</Combobox.ItemText>
                                        <Combobox.ItemIndicator>
                                            <LuCheck />
                                        </Combobox.ItemIndicator>
                                    </Combobox.Item>
                                ))}
                            </Combobox.List>
                        </Combobox.Content>
                    </Combobox.Positioner>
                </Portal>
            </Combobox.Root>
        </Box>
    )
}
