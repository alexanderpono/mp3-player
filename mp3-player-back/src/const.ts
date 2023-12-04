export const WS_SERVER_PORT = 8707;
export const USB_DEVICE = 'sdb';
export const MOUNT_PATH_START = '/media';
export const REST_SERVER_PORT = 8708;

export enum WsEvent {
    DEFAULT = '',
    HELLO = 'Привет',
    MOUNT = 'USB drive mount',
    UNMOUNT = 'USB drive unmount'
}
