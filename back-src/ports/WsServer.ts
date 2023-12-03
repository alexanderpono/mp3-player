import { WebSocket } from 'ws';
import { createWsHello } from './WsServer.types';

interface MainControllerForWs {
    onWsMesage: (msg: string) => void;
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
        this.wsClient.send(JSON.stringify(createWsHello()));
        this.wsClient.on('message', this.onMessage);

        this.wsClient.on('close', function () {
            console.log('WsServer: Пользователь отключился');
        });
    };

    onMessage = (messageB: Buffer) => {
        const message = messageB.toString('utf-8');
        this.ctrl.onWsMesage(message);
    };

    send = (s: string) => {
        this.wsClient.send(s);
    };
}
