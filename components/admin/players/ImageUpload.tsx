'use client'

import { useRef, useState } from 'react'
import { Box, Button, Image, VStack, Spinner } from '@chakra-ui/react'
import { LuUpload, LuTrash } from 'react-icons/lu'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'm8dle_preset')

            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            if (!cloudName) {
                console.error('La variable d\'environnement NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME n\'est pas définie.')
                setIsUploading(false)
                return
            }

            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (data.secure_url) {
                onChange(data.secure_url)
            } else {
                console.error('Erreur Cloudinary:', data)
            }
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    return (
        <VStack align="stretch" gap="1rem">
            {value ? (
                <Box position="relative" borderRadius="md" overflow="hidden" borderWidth="1px">
                    <Image src={value} alt="Uploaded preview" width="full" height="auto" objectFit="contain" maxH="200px" />
                    <Button
                        position="absolute"
                        top="2"
                        right="2"
                        size="sm"
                        colorPalette="red"
                        variant="solid"
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
                {isUploading ? <Spinner size="sm" mr={2} /> : <LuUpload />}
                {isUploading ? 'Upload en cours...' : (value ? 'Changer l\'image' : 'Uploader une image')}
            </Button>
        </VStack>
    )
}
