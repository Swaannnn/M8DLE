import { Provider } from '@/components/ui/provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import { Box } from '@chakra-ui/react'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'M8DLE',
    description: 'M8DLE',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html
            lang="fr"
            suppressHydrationWarning
        >
            <body className={inter.className}>
                <Provider>
                    <Box
                        bg="bg"
                        color="fg"
                        minHeight="calc(100vh)"
                    >
                        <NavBar />
                        <main style={{ paddingBottom: '4rem' }}>{children}</main>
                        <Footer />
                    </Box>
                </Provider>
            </body>
        </html>
    )
}

export default RootLayout
