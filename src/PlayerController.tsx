import React from 'react';
import { render } from 'react-dom';
import { PlayerUI } from './components/PlayerUI';
import { PlayState } from './PlayerController.types';

export class PlayerController {
    private player: HTMLAudioElement;
    private fName: string;

    constructor() {}

    ifSupportsAudio = () => {
        const supportsAudio = !!document.createElement('audio').canPlayType;
    };
    go = () => {
        this.renderUI();
    };
    playFile = (fName: string) => {
        this.fName = fName;
        this.player.src = '/' + fName;
    };

    onUIMount = () => {
        console.log('onUIMount() this.player=', this.player);
        this.player.addEventListener('timeupdate', this.onTimeUpdate, false);
        setTimeout(() => {
            console.log('timeout()');
            this.playFile('01-Sirius.mp3');
        }, 1000);
    };

    renderUI = () => {
        const duration = this.player?.duration ? this.player?.duration : 0;
        const currentTime = this.player?.currentTime ? this.player?.currentTime : 0;
        const isPlaying = duration > 0 && !this.player?.paused && !this.player?.ended;

        const percentage = duration ? Math.floor((100 / this.player.duration) * currentTime) : 0;
        const playState: PlayState = {
            duration,
            currentTime,
            percentage,
            isPlaying,
            fileName: this.fName
        };
        render(<PlayerUI ctrl={this} playState={playState} />, document.getElementById('player'));
    };

    onSoundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let file: File | null = e.target.files ? e.target.files[0] : null;

        if (typeof file?.name !== 'string') {
            console.log('onUploadFileChange(): unrecognized data');
            return;
        }
        console.log('onSoundFileChange() file=', file);
        const canPlay = this.player.canPlayType(file?.type);
        console.log('onSoundFileChange() canPlay=', canPlay);
        if (canPlay) {
            console.log('onSoundFileChange() src=', URL.createObjectURL(file));
            this.player.src = URL.createObjectURL(file);
        } else {
            // this.resetPlayer();
        }
        e.target.value = '';
    };

    setPlayer = (audioEl: HTMLAudioElement) => (this.player = audioEl);

    onBtPlayClick = () => {
        this.player.play();
    };

    onBtPauseClick = () => {
        this.player.pause();
    };

    resetPlayer = () => {
        this.player.src = '';
        this.player.currentTime = 0;
    };

    onTimeUpdate = () => {
        this.renderUI();
    };
}