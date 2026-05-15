import { useState } from 'react'

export const useWinDialog = (win: boolean) => {
    const [isDismissed, setIsDismissed] = useState(false);

    if (!win && isDismissed) {
        setIsDismissed(false);
    }

    const isOpen = win && !isDismissed;
    return {
        isOpen,
        closeDialog: () => setIsDismissed(true)
    };
}
