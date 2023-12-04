import { GetFilesAnswer } from './ports/FileStorageApi';

export interface PlayerControllerForUI {
    onSoundFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUIMount: () => void;
    setPlayer: (ref: HTMLAudioElement) => void;
    onBtPlayClick: () => void;
    onBtPauseClick: () => void;
    onBtStopClick: () => void;
    onBtEjectClick: () => void;
    onFileClick: (e: React.MouseEvent) => void;
    onProgressClick: (progress: number) => void;
}

export interface PlayState {
    duration: number;
    currentTime: number;
    percentage: number;
    isPlaying: boolean;
    fileName: string;
    apiAnswer: GetFilesAnswer;
    selectedFile: string;
}
