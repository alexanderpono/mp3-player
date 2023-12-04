import React from 'react';
import styles from './PlayerUI.scss';
import cn from 'classnames';

interface ProgressProps {
    value: number;
    onClick: (percent: number) => void;
}

export const Progress: React.FC<ProgressProps> = ({ value, onClick }) => {
    const onMyClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLProgressElement;

        const dx = e.clientX - target.offsetLeft;
        const part = dx / target.clientWidth;
        const percent = part * 100;
        onClick(percent);
    };
    return (
        <progress
            className={styles.progress}
            max="100"
            value={value}
            onClick={onMyClick}
        ></progress>
    );
};
