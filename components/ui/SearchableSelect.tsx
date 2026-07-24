import { useMemo } from 'react'
import { Combobox, createListCollection, Portal, Box } from '@chakra-ui/react'
import { LuCheck, LuChevronDown } from 'react-icons/lu'

export type SearchableSelectProps = {
    value?: string | null
    onChange: (value: string) => void
    options: { value: string; label: string }[]
    placeholder?: string
    width?: any
}

export function SearchableSelect({ value, onChange, options, placeholder = 'Select...', width = 'full' }: SearchableSelectProps) {
    const collection = useMemo(() => createListCollection({
        items: options,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
    }), [options])

    return (
        <Box width={width}>
            <Combobox.Root
                collection={collection}
                value={value ? [value] : []}
                onValueChange={(e) => onChange(e.value[0] || '')}
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
                                {options.map((item) => (
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
