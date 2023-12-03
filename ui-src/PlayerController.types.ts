export interface PlayerControllerForUI {
    onSoundFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUIMount: () => void;
    setPlayer: (ref: HTMLAudioElement) => void;
    onBtPlayClick: () => void;
    onBtPauseClick: () => void;
}

export interface PlayState {
    duration: number;
    currentTime: number;
    percentage: number;
    isPlaying: boolean;
    fileName: string;
}
