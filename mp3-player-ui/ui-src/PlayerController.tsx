import React from 'react';
import { render } from 'react-dom';
import { PlayerUI } from './components/PlayerUI';
import { PlayState } from './PlayerController.types';
import { WsClient } from './ports/WsClient';
import { DIRECTORY, REST_SERVER_PORT } from '@config/const';
import { WsEvent } from '@config/WsEvent';
import {
    FileStats,
    FileStorageApi,
    GetFilesAnswer,
    defaultGetFilesAnswer
} from './ports/FileStorageApi';
import { AxiosResponse } from 'axios';

export class PlayerController {
    private player: HTMLAudioElement;
    private fName: string;
    private apiAnswer: GetFilesAnswer = { ...defaultGetFilesAnswer };
    private selectedFile: string;
    private playedFile: string;

    constructor(private ws: WsClient, private fileStorage: FileStorageApi) {
        this.selectedFile = '';
        this.fName = '';
        this.playedFile = '';
    }

    ifSupportsAudio = () => {
        const supportsAudio = !!document.createElement('audio').canPlayType;
    };
    go = () => {
        this.ws.connect();
        this.renderUI();
        return this;
    };
    playFile = (fName: string) => {
        this.fName = fName;
        this.player.src = fName;
    };

    onUIMount = () => {
        this.player.addEventListener('timeupdate', this.onTimeUpdate, false);
    };

    isPaused = () => this.player?.paused;

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
            fileName: this.fName,
            apiAnswer: this.apiAnswer,
            selectedFile: this.selectedFile
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
        if (this.isFile(this.selectedFile)) {
            const fileUrl = `http://localhost:${REST_SERVER_PORT}/file${this.selectedFile}`;
            console.log('onFileClick() fileUrl=', fileUrl);
            this.playFile(fileUrl);
            this.playedFile = this.selectedFile;
            this.renderUI();
        }

        this.player.play();
    };

    onBtPauseClick = () => {
        if (this.isPaused()) {
            this.player.play();
        } else {
            this.player.pause();
        }
    };

    onBtStopClick = () => {
        this.onBtPauseClick();
        this.resetPlayer();
    };

    resetPlayer = () => {
        this.playFile('');
        this.player.currentTime = 0;
    };

    onTimeUpdate = () => {
        this.renderUI();
        if (this.player?.ended) {
            this.onFinishSong();
        }
    };

    onFinishSong = () => {
        const hasNextSong = this.hasNextSong();
        if (hasNextSong) {
            const nextSongName = this.getNextSong();
            this.selectFile(nextSongName);
            this.onBtPlayClick();
        }
    };

    getPlayedSongIndex = () => {
        return this.apiAnswer.files.findIndex((file: FileStats) => {
            return file.name === this.playedFile;
        });
    };
    hasNextSong = () => {
        const playedSongIndex = this.getPlayedSongIndex();
        return playedSongIndex < this.apiAnswer.files.length - 1;
    };

    getNextSong = (): string => {
        if (!this.hasNextSong()) {
            return '';
        }
        const playedSongIndex = this.getPlayedSongIndex();
        return this.apiAnswer.files[playedSongIndex + 1].name;
    };

    onWsMessage = (message: string) => {
        console.log('onWsMessage() message=', message);
        const wsMessage = JSON.parse(message);
        console.log('onWsMessage() wsMessage=', wsMessage);
        if (wsMessage.event === WsEvent.MOUNT) {
            console.log('onWsMessage() mount!');
            this.fileStorage
                .getDir()
                .then((apiAnswer: AxiosResponse<GetFilesAnswer>) => {
                    this.apiAnswer = apiAnswer.data;
                    this.renderUI();
                })
                .catch((err) => {
                    console.log('catch() err=', err);
                });
        }
        if (wsMessage.event === WsEvent.UNMOUNT) {
            console.log('onWsMessage() unmount!');
            this.apiAnswer = { ...defaultGetFilesAnswer };
            this.selectedFile = '';
            this.player.pause();
            this.resetPlayer();
            this.renderUI();
        }
    };

    isFile = (fileName: string): boolean => {
        const recordIndex = this.apiAnswer.files.findIndex(
            (file: FileStats) => file.name === fileName
        );
        if (recordIndex < 0) {
            console.error('selected file is not found in files', fileName, this.apiAnswer);
            return false;
        }
        const fileInfo = this.apiAnswer.files[recordIndex];
        return fileInfo.size !== DIRECTORY;
    };

    selectFile = (fileName: string) => {
        this.selectedFile = fileName;
        this.renderUI();
    };

    onFileClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const fileName = target.dataset.file;
        console.log('onFileClick() fileName=', fileName);
        this.selectFile(fileName);
    };

    onProgressClick = (percent: number) => {
        if (this.player.src) {
            const newTimePos = (this.player.duration * percent) / 100;

            this.player.currentTime = newTimePos;
        }
    };

    onBtEjectClick = () => {
        console.log('onBtEjectClick()');
        this.fileStorage.eject();
    };
}
