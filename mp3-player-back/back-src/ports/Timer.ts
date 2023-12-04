interface TimerListener {
    onTick: () => void;
}
export class Timer {
    constructor(private listener: TimerListener) {}
    count = 0;
    private started = false;

    start = () => {
        if (this.started) {
            return false;
        }
        this.started = true;
        this.onTick();
    };

    stop = () => (this.started = false);

    isStarted = () => this.started;

    onTick = () => {
        this.count++;
        this.listener.onTick();
        if (this.started) {
            setTimeout(this.onTick, 1000);
        }
    };
}
