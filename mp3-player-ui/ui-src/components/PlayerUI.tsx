import React from 'react';
import styles from './PlayerUI.scss';
import { PlayState, PlayerControllerForUI } from '@ui-src/PlayerController.types';
import { formatTime } from '@ui-src/adapters/formatTime';
import { FileStats } from '@ui-src/ports/FileStorageApi';
import { DIRECTORY } from '@src/const';
import cn from 'classnames';
import { ProgressBox } from './ProgressBox';

interface PlayerUIProps {
    ctrl: PlayerControllerForUI;
    playState: PlayState;
}

export const PlayerUI: React.FC<PlayerUIProps> = ({ ctrl, playState }) => {
    const audioRef = React.useRef(null);

    React.useEffect(() => {
        // console.log('audioRef.current=', audioRef.current);
        ctrl.setPlayer(audioRef.current);
        ctrl.onUIMount();
    }, []);
    return (
        <section>
            <audio id="music" autoPlay={true} ref={audioRef}>
                Your browser does not support the audio format.
            </audio>
            <div className={styles.playTime}>
                {formatTime(Math.floor(playState.currentTime))} /{' '}
                {formatTime(Math.floor(playState.duration))}
            </div>

            <div className={styles.progressWrap}>
                <ProgressBox value={playState.percentage} onClick={ctrl.onProgressClick} />
            </div>
            <div className={styles.playbackButtons}>
                <button title="play" onClick={ctrl.onBtPlayClick}>
                    Воспроизведение
                </button>
                <button title="pause" onClick={ctrl.onBtPauseClick}>
                    Пауза
                </button>

                <button title="stop" onClick={ctrl.onBtStopClick}>
                    Стоп
                </button>
                <button title="Извлечь" onClick={ctrl.onBtEjectClick}>
                    Извлечь
                </button>
            </div>

            {/* <input
                type="range"
                id="volume-bar"
                title="volume"
                min="0"
                max="10"
                step="1"
                value="10"
                onChange={() => {}}
            />
            <button id="btnMute" className="mute" title="mute" onClick={() => 'muteVolume();'}>
                Mute
            </button> */}
            <section className={styles.files}>
                {playState.apiAnswer?.files.map((file: FileStats) => {
                    const caption = file.size === DIRECTORY ? `[${file.name}]` : file.name;
                    return (
                        <p
                            key={file.name}
                            data-file={file.name}
                            onClick={ctrl.onFileClick}
                            className={cn({
                                [styles.sel]: file.name === playState.selectedFile
                            })}
                        >
                            {caption}
                        </p>
                    );
                })}
            </section>
        </section>
    );
};
