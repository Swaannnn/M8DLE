import { createSystem, defaultConfig } from '@chakra-ui/react'

const system = createSystem(defaultConfig, {
    theme: {
        tokens: {
            colors: {
                brand: {
                    500: { value: '#7c3aed' },
                },
            },
        },
    },
})

export default system
