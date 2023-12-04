import React from 'react';
import styles from './PlayerUI.scss';
import { findNodeWithDataAttr } from '@ui-src/ports/domUtils';

interface ProgressProps {
    value: number;
    onClick: (progress: number) => void;
}

export const ProgressBox: React.FC<ProgressProps> = ({ value, onClick }) => {
    const onMyClick = (e) => {
        const el = findNodeWithDataAttr(e.target, 'type', 3);

        const dx = e.clientX - el.offsetLeft;
        const part = dx / el.clientWidth;
        const percent = part * 100;
        onClick(percent);
    };

    return (
        <div className={styles.progressbar} onClick={onMyClick} data-type="wrapper">
            <span style={{ width: `${Math.floor(value)}%` }}></span>
        </div>
    );
};
