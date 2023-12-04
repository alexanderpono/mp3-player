import React from 'react';
import styles from './PlayerUI.scss';
import { PlayState, PlayerControllerForUI } from '@ui-src/PlayerController.types';
import { formatTime } from '@ui-src/adapters/formatTime';
import { FileStats } from '@ui-src/ports/FileStorageApi';
import { DIRECTORY } from '@src/const';
import cn from 'classnames';

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
            <h1>PlayerUI</h1>

            <h1>HTML5 Audio Player Demo</h1>
            <input type="file" accept="audio/*" onChange={ctrl.onSoundFileChange} />
            <div id="message"></div>
            <audio controls id="music" autoPlay={true} ref={audioRef}>
                Your browser does not support the audio format.
            </audio>
            <div id="audio_player">
                <progress id="progress-bar" max="100" value={playState.percentage}>
                    0% played
                </progress>
                <button
                    id="btnReplay"
                    className="replay"
                    title="replay"
                    accessKey="R"
                    onClick={() => 'replayAudio();'}
                >
                    Replay
                </button>
                {!playState.isPlaying && (
                    <button
                        id="btnPlay"
                        className="play"
                        title="play"
                        accessKey="P"
                        onClick={ctrl.onBtPlayClick}
                    >
                        Play
                    </button>
                )}
                {playState.isPlaying && (
                    <button
                        id="btnPause"
                        className="pause"
                        title="pause"
                        accessKey="P"
                        onClick={ctrl.onBtPauseClick}
                    >
                        Pause
                    </button>
                )}

                <button
                    id="btnStop"
                    className="stop"
                    title="stop"
                    accessKey="X"
                    onClick={() => 'stopAudio();'}
                >
                    Stop
                </button>
                <input
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
                </button>
                <div>
                    {formatTime(Math.floor(playState.currentTime))} /{' '}
                    {formatTime(Math.floor(playState.duration))}
                </div>
                <div>{playState.fileName}</div>
                <section>
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
            </div>
        </section>
    );
};
