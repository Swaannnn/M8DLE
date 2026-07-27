import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
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
