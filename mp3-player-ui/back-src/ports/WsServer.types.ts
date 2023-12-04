import { WsEvent } from '@src/const';

export const WS = {
    createWsHello: () => ({
        event: WsEvent.HELLO
    }),
    createWsUsbDriveMount: () => ({
        event: WsEvent.MOUNT
    }),
    createWsUsbDriveUnmount: () => ({
        event: WsEvent.UNMOUNT
    })
};
