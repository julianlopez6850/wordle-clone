import React from 'react';
import styles from './toast.module.css';
import { useMemo } from 'react';

export const Toast = ({ mode, onClose, message}) => {

    const classes = useMemo(() => [styles.toast, styles[mode]].join(' '),
    [mode],
    );

    return (
        <div /*onClick={onClose}*/ className={classes}>
            <div className={styles.message}>{message}</div>
        </div>
    )
}