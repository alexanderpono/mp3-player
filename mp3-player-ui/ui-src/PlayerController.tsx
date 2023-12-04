import React from 'react';
import { render } from 'react-dom';
import { PlayerUI } from './components/PlayerUI';
import { PlayState } from './PlayerController.types';
import { WsClient } from './ports/WsClient';
import { WsMessage } from '@ui-src/ports/WsMessage';
import { DIRECTORY, REST_SERVER_PORT, WsEvent } from '@src/const';
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

    constructor(private ws: WsClient, private fileStorage: FileStorageApi) {
        this.selectedFile = '';
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
        console.log('onUIMount() this.player=', this.player);
        this.player.addEventListener('timeupdate', this.onTimeUpdate, false);
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
            this.renderUI();
        }

        this.player.play();
    };

    onBtPauseClick = () => {
        this.player.pause();
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
    };

    onWsMessage = (message: string) => {
        console.log('onWsMessage() message=', message);
        const wsMessage = new WsMessage().fromJSON(JSON.parse(message));
        console.log('onWsMessage() wsMessage=', wsMessage);
        if (wsMessage.event === WsEvent.MOUNT) {
            console.log('onWsMessage() mount!');
            this.fileStorage
                .getDir()
                .then((apiAnswer: AxiosResponse<GetFilesAnswer>) => {
                    this.apiAnswer = apiAnswer.data;
                    console.log('then() this.apiAnswer=', this.apiAnswer);
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
        console.log('isFile() fileName=', fileName);
        console.log('isFile() this.apiAnswer=', this.apiAnswer);
        const recordIndex = this.apiAnswer.files.findIndex(
            (file: FileStats) => file.name === fileName
        );
        if (recordIndex < 0) {
            console.error('selected file is not found in files', fileName, this.apiAnswer);
            return false;
        }
        const fileInfo = this.apiAnswer.files[recordIndex];
        console.log('isFile() fileInfo=', fileInfo);
        return fileInfo.size !== DIRECTORY;
    };

    onFileClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        console.log('onFileClick() target=', target);
        const fileName = target.dataset.file;
        console.log('onFileClick() fileName=', fileName);
        this.selectedFile = fileName;
        this.renderUI();
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
