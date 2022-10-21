import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useToastAutoClose } from './helpers/useToastAutoClose';
import ReactDOM from 'react-dom';
import { Toast } from './Toast';
import { uuid } from './helpers/getUUID.js';
import styles from "./toast.module.css"

export const ToastPortal = forwardRef(({ autoClose, autoCloseTime = 1500}, ref) => {
    const [toasts, setToasts] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [portalId] = useState(`toast-portal-${uuid()}`);

    useEffect (() => {
        const div = document.createElement('div');
        div.id = portalId;
        div.style = 'position: fixed; top: 80px; width: 100%; display:flex; align-items: center; justify-content: center;';
        document.getElementsByTagName('body')[0].prepend(div);

        setLoaded(true);

        return () => document.getElementsByTagName('body')[0].removeChild(div);
    }, [portalId]);

    
    if(ref.message === "game reset")
        setToasts([]);
    
    useToastAutoClose({
        toasts,
        setToasts,
        autoClose,
        autoCloseTime,
    })

    const removeToast = id => {
        setToasts(toasts.filter(t => t.id !== id))
    };

    useImperativeHandle(ref, () => ({
        addMessage(toast) {
            setToasts([ ...toasts, {...toast, id: uuid() }]);
        },
        removeToasts(toast) {
                setToasts([]);
        }
    }));
    
    return loaded ? (
        ReactDOM.createPortal(
            <div className={styles.mappedToasts}>
                {toasts.map(t => (
                    <Toast 
                        key={t.id}
                        mode={t.mode}
                        message={t.message}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>,
            document.getElementById(portalId)
        )
    ) : <></>;
})