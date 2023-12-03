import { UsbDrive, defaultUsbDrive, getUsbDriveFromOutput } from './adapters/usbDriveFromOutput';
import { Timer } from './ports/Timer';
import { UsbDriveMonitor } from './ports/UsbDriveMonitor';
import { WsServer } from './ports/WsServer';
import { WS } from './ports/WsServer.types';

interface JsonMessageFromUI {
    action: string;
    data: string;
}
export class ServerController {
    private ws: WsServer;
    private usbDriveMonitor: UsbDriveMonitor = null;
    private timer: Timer = null;
    private usbDriveMountState: UsbDrive = { ...defaultUsbDrive };

    constructor(port: number, usbDevice: string, private mountPathStart: string) {
        this.ws = new WsServer(this);
        this.usbDriveMonitor = new UsbDriveMonitor(usbDevice);
        this.timer = new Timer(this);
        this.timer.start();

        this.ws.openWsServer(port);
        console.log(`ServerController: listening ${port}`);

        console.log('ServerController() constructor()');
    }

    onTick = () => {
        this.usbDriveMonitor.checkUsbDrive().then((output: string) => {
            const driveInfo = getUsbDriveFromOutput(output, this.mountPathStart);

            if (this.usbDriveMountState.id !== driveInfo.id) {
                this.onMountStateChange(driveInfo);
            }
        });
    };

    onMountStateChange = (driveInfo: UsbDrive) => {
        this.usbDriveMountState = driveInfo;
        if (driveInfo.id === '') {
            console.log('USB drive unmount');
            this.ws.send(WS.createWsUsbDriveUnmount());
        } else {
            console.log('USB drive mount', driveInfo);
            this.ws.send(WS.createWsUsbDriveMount());
        }
    };

    onWsConnect = () => {
        this.ws.send(WS.createWsHello());
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
