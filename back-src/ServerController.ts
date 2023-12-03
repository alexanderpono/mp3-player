import { WsServer } from './ports/WsServer';

interface JsonMessageFromUI {
    action: string;
    data: string;
}
export class ServerController {
    private ws: WsServer;

    constructor(port: number) {
        this.ws = new WsServer(this);

        this.ws.openWsServer(port);
        console.log(`ServerController: listening ${port}`);

        console.log('ServerController() constructor()');
    }

    onMessageFromSerial = (text: string) => {
        console.log('ServerController: Serial:', text);
        try {
            this.ws.send(JSON.stringify({ fromSerial: text }));
        } catch (e) {
            console.log('ServerController: Error send to WS:', text);
        }
    };

    onWsMesage = (message: string) => {
        console.log('on(message) message=', message);
        try {
            const jsonMessage: JsonMessageFromUI = JSON.parse(message);
            console.log('on(message) jsonMessage=', jsonMessage);
            switch (jsonMessage.action) {
                case 'TO_SERIAL':
                    console.log('jsonMessage=', jsonMessage);
                    break;
                default:
                    console.log('Ws: Неизвестная команда');
                    break;
            }
        } catch (error) {
            console.log('Ws: Ошибка', error);
        }
    };
}
