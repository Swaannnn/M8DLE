'use client'

import { useRef, useState } from 'react'
import { Box, Button, Image, VStack, Spinner } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { LuUpload, LuTrash } from 'react-icons/lu'
import { fetcher } from '@/utils/fetcher'
import { useShowApiErrorToast } from '@/hooks/use-api-error-toast'
import type { UploadedImage } from '@/types/storage'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const t = useTranslations('ui')
    const showApiErrorToast = useShowApiErrorToast()
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)

            // Pas de Content-Type manuel : le navigateur doit poser lui-même la boundary du multipart.
            const uploaded = await fetcher<UploadedImage>('/api/storage', {
                method: 'POST',
                body: formData,
            })

            onChange(uploaded.url)
        } catch (error) {
            showApiErrorToast(error)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <VStack
            align="stretch"
            gap="1rem"
        >
            {value ? (
                <Box
                    position="relative"
                    borderRadius="md"
                    overflow="hidden"
                    borderWidth="1px"
                >
                    <Image
                        src={value}
                        alt="Uploaded preview"
                        width="full"
                        height="auto"
                        objectFit="contain"
                        maxH="200px"
                    />
                    <Button
                        position="absolute"
                        top="2"
                        right="2"
                        size="sm"
                        colorPalette="red"
                        variant="solid"
                        aria-label={t('removeImage')}
                        onClick={() => onChange('')}
                    >
                        <LuTrash />
                    </Button>
                </Box>
            ) : null}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                w="full"
                type="button"
                disabled={isUploading}
            >
                {isUploading ? (
                    <Spinner
                        size="sm"
                        mr={2}
                    />
                ) : (
                    <LuUpload />
                )}
                {isUploading ? t('uploadingImage') : value ? t('changeImage') : t('uploadImage')}
            </Button>
        </VStack>
    )
}
