import { useEffect, useState } from "react";

// this function handles auto close for toasts
export const useToastAutoClose = ({
    toasts,
    setToasts,
    autoClose,
    autoCloseTime,
}) => {
    const [removing, setRemoving] = useState('');

    useEffect(() => {
        if(removing) {
            setToasts(t => t.filter(_t => _t.id !== removing));
        }
    }, [removing]);

    useEffect(() => {
        if(autoClose && toasts.length) {
            const id = toasts[toasts.length - 1].id;
            setTimeout(() => setRemoving(id), autoCloseTime);
        }
    }, [toasts, autoClose, autoCloseTime]);
}