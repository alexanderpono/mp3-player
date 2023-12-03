interface TimerListener {
    onTick: () => void;
}
export class Timer {
    constructor(private listener: TimerListener) {}
    count = 0;
    start = () => {
        this.onTick();
    };

    onTick = () => {
        this.count++;
        this.listener.onTick();
        setTimeout(this.onTick, 1000);
    };
}
