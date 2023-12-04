console.log(`back.ts! 2`);

import { MOUNT_PATH_START, REST_SERVER_PORT, USB_DEVICE, WS_SERVER_PORT } from '@src/const';

import { ServerController } from './ServerController';

let server: ServerController;
class Program {
    async main() {
        server = new ServerController(
            WS_SERVER_PORT,
            USB_DEVICE,
            MOUNT_PATH_START,
            REST_SERVER_PORT
        );
    }

    static create(): Program {
        return new Program();
    }
}

Program.create().main();
