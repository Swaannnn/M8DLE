import { useRef, useState } from 'react'
import { Button, IconButton } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import CheckIcon from './icons/CheckIcon'
import ClipboardIcon from './icons/ClipboardIcon'
import { Tooltip } from './ui/tooltip'

type CopyButtonProps = {
    variant?: 'full' | 'icon'
    text: string
}

const CopyButton = ({ text, variant = 'full' }: CopyButtonProps) => {
    const t = useTranslations('dialogWin')
    const [copied, setCopied] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleClick = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), 2000)
    }

    if (variant === 'icon') {
        return (
            <Tooltip content={t('copyText')}>
                <IconButton
                    variant="outline"
                    size="sm"
                    onClick={handleClick}
                >
                    {copied ? <CheckIcon /> : <ClipboardIcon />}
                </IconButton>
            </Tooltip>
        )
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
        >
            {copied ? (
                <>
                    {t('copiedText')}
                    <CheckIcon />
                </>
            ) : (
                <>
                    {t('copyText')}
                    <ClipboardIcon />
                </>
            )}
        </Button>
    )
}

export default CopyButton
