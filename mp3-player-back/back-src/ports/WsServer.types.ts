import { WsEvent } from '@config/WsEvent';

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
