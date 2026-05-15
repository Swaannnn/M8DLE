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
import { getTranslations } from 'next-intl/server'

const inter = Inter({ subsets: ['latin'] })

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params

    const t = await getTranslations({
        locale,
        namespace: 'metadata',
    })

    return {
        metadataBase: new URL('https://m8dle.com'),

        title: {
            default: t('title'),
            template: '%s | M8DLE',
        },

        description: t('description'),

        keywords: t.raw('keywords') as string[],

        openGraph: {
            title: t('title'),
            description: t('description'),
            url: 'https://m8dle.com',
            siteName: 'M8DLE',
            type: 'website',
            locale: locale === 'fr' ? 'fr_FR' : 'en_US',
            images: [
                {
                    url: '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: t('title'),
                },
            ],
        },

        robots: {
            index: true,
            follow: true,
        },
    }
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
