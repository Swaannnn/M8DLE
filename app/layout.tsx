import { Provider } from '@/components/ui/provider'
import { NextIntlClientProvider } from 'next-intl'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import { Box } from '@chakra-ui/react'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL('https://m8dle.com'),

    title: {
        default: 'M8DLE - Devine le joueur Gentle Mates du jour',
        template: '%s | M8DLE',
    },

    description:
        "M8DLE est un jeu quotidien inspiré de Wordle basé sur l'univers Gentle Mates. Devine le joueur du jour et compare ton score avec la communauté.",

    keywords: ['gentlemates', 'm8dle', 'jeu gentlemates', 'gentlemates game', 'gentlemates wordle', 'dle'],

    openGraph: {
        title: 'M8DLE - Devine le joueur Gentle Mates du jour',
        description:
            "M8DLE est un jeu quotidien inspiré de Wordle basé sur l'univers Gentle Mates. Devine le joueur du jour et compare ton score avec la communauté.",
        url: 'https://m8dle.com',
        siteName: 'M8DLE',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 686, // 1200
                height: 360, // 630
                alt: 'M8DLE - Devine le joueur Gentle Mates du jour',
            },
        ],
    },

    robots: {
        index: true,
        follow: true,
    },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html
            lang="fr"
            suppressHydrationWarning
        >
            <body className={inter.className}>
                <Analytics />
                <SpeedInsights />
                <Provider>
                    <NextIntlClientProvider>
                        <Box
                            bg="bg"
                            color="fg"
                            minHeight="calc(100vh)"
                        >
                            <NavBar />
                            <main style={{ paddingBottom: '4rem', paddingTop: '6rem' }}>{children}</main>
                            <Footer />
                        </Box>
                    </NextIntlClientProvider>
                </Provider>
            </body>
        </html>
    )
}

export default RootLayout
