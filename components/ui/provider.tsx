'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider, ColorModeProviderProps } from './color-mode'

export function Provider({ children }: ColorModeProviderProps) {
    return (
        <ChakraProvider value={defaultSystem}>
            <ColorModeProvider>{children}</ColorModeProvider>
        </ChakraProvider>
    )
}
