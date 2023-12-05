import { MOUNT_PATH_START, OS, REST_SERVER_PORT, USB_DEVICE, WS_SERVER_PORT } from '@config/const';

import { ServerController } from './ServerController';
import { UsbDriveMonitor } from './ports/UsbDriveMonitor';
import { UsbDriveMonitorWin } from './ports/UsbDriveMonitorWin';
import { OSType } from '@config/OSType';

let server: ServerController;
class Program {
    async main() {
        const usbDriveMonitor = OS === OSType.linux ? new UsbDriveMonitor(USB_DEVICE) : new UsbDriveMonitorWin(USB_DEVICE);        
        server = new ServerController(
            WS_SERVER_PORT,
            USB_DEVICE,
            MOUNT_PATH_START,
            REST_SERVER_PORT,
            usbDriveMonitor
        );
    }

    static create(): Program {
        return new Program();
    }
}

Program.create().main();
