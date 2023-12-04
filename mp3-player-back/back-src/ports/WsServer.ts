import { WebSocket } from 'ws';

interface MainControllerForWs {
    onWsMesage: (msg: string) => void;
    onWsConnect: () => void;
}
export class WsServer {
    private wsClient;
    private wsServer = null;

    constructor(private ctrl: MainControllerForWs) {}

    openWsServer = (port: number) => {
        this.wsServer = new WebSocket.Server({ port });
        this.wsServer.on('connection', this.onConnect);
    };

    onConnect = (wsClient) => {
        this.wsClient = wsClient;
        console.log('WsServer: Новый пользователь');
        this.ctrl.onWsConnect();
        this.wsClient.on('message', this.onMessage);

        this.wsClient.on('close', function () {
            console.log('WsServer: Пользователь отключился');
        });
    };

    onMessage = (messageB: Buffer) => {
        const message = messageB.toString('utf-8');
        this.ctrl.onWsMesage(message);
    };

    send = (o: object) => {
        this.wsClient.send(JSON.stringify(o));
    };
}
