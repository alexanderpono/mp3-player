export class WsClient {
    private ws: WebSocket;
    private url: string;
    constructor(private wsPort: number) {
        this.url = `ws://localhost:${this.wsPort}`;
    }

    connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            console.log(`WsClient: подключился к ${this.url}`);
        };
        this.ws.onmessage = (message) => {
            console.log('WsClient: ', message.data);
        };

        this.ws.onclose = () => {
            console.log('WsClient: отключился. Автоподключение через 5 сек...');
            setTimeout(() => {
                console.log('WsClient: Попытка подключения к WS');
                this.connect();
            }, 5000);
        };
    }
}
