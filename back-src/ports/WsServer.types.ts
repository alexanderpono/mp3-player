export const WS = {
    createWsHello: () => ({
        fromServer: 'Привет'
    }),
    createWsUsbDriveMount: () => ({
        event: 'USB drive mount'
    }),
    createWsUsbDriveUnmount: () => ({
        event: 'USB drive unmount'
    })
};
