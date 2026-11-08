import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    // Bundle autonome (.next/standalone) pour l'image Docker déployée sur Coolify.
    output: 'standalone',
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
            },
        ],
    },
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
