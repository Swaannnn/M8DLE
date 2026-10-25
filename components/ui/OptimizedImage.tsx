'use client'

import Image, { type ImageProps } from 'next/image'
import { getImageLoader } from '@/utils/imageLoader'

/** next/image qui confie les images Cloudinary à Cloudinary, et le reste à l'optimiseur de Next. */
const OptimizedImage = ({ alt, ...props }: ImageProps) => (
    <Image
        alt={alt}
        loader={typeof props.src === 'string' ? getImageLoader(props.src) : undefined}
        {...props}
    />
)

export default OptimizedImage
