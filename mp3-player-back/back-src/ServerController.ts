import { UsbDrive, defaultUsbDrive, getUsbDriveFromOutput } from './adapters/usbDriveFromOutput';
import { FsInput } from './ports/FsInput';
import { RestServer } from './ports/RestServer';
import { Timer } from './ports/Timer';
import { UsbDriveContent } from './ports/UsbDriveContent';
import { UsbDriveMonitor } from './ports/UsbDriveMonitor';
import { WsServer } from './ports/WsServer';
import { WS } from './ports/WsServer.types';
import path from 'path';

interface JsonMessageFromUI {
    action: string;
    data: string;
}
export class ServerController {
    private ws: WsServer;
    private usbDriveMonitor: UsbDriveMonitor = null;
    private timer: Timer = null;
    private usbDriveMountState: UsbDrive = { ...defaultUsbDrive };
    private rest: RestServer;
    private usbDriveContent: UsbDriveContent = null;
    private fsInput: FsInput = null;

    constructor(
        port: number,
        private usbDevice: string,
        private mountPathStart: string,
        private restPort: number
    ) {
        this.ws = new WsServer(this);

        this.ws.openWsServer(port);
        console.log(`ServerController: WS listening ${port}`);

        this.usbDriveMonitor = new UsbDriveMonitor(this.usbDevice);
        this.usbDriveContent = new UsbDriveContent();
        this.timer = new Timer(this);
        this.rest = new RestServer(this.restPort, this);
        this.fsInput = new FsInput();
        console.log(`ServerController: REST listening ${this.restPort}`);

        this.rest.run();

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

    resetMountState = () => {
        this.usbDriveMountState = { ...defaultUsbDrive };
    };

    onWsConnect = () => {
        // this.ws.send(WS.createWsHello());
        this.resetMountState();
        this.timer.start();
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

    onRestGetRoot = (req, response) => {
        response.send('Hello World');
    };

    onRestGetFolder = (request, response) => {
        console.log('ServerController onRestGetFolder response=', 2);
        response.header('Access-Control-Allow-Origin', '*');
        response.send(`GET folder ${request.params.id}`);
    };

    onRestGetRootFolder = (request, response) => {
        console.log('ServerController onRestGetFolder response=', 1);
        response.header('Access-Control-Allow-Origin', '*');
        response.setHeader('content-type', 'application/json');
        this.fsInput
            .getDirStats(
                this.usbDriveMountState.mountPath,
                '',
                ['System Volume Information', '.Trash-1000'],
                0
            )
            .then((files) => {
                console.log('files=', files);
                response.send({
                    files
                });
            });
    };

    onRestGetFile = (request, response) => {
        console.log('ServerController onRestGetFile()');
        response.header('Access-Control-Allow-Origin', '*');

        let p = path.join(this.usbDriveMountState.mountPath, request.params.id);
        // response.send(`GET file ${request.params.id} ${p}`);

        console.log('ServerController onRestGetFile() p=', p);

        response.sendFile(p);
    };
}
