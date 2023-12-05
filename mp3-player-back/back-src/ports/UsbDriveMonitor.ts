import { exec } from 'child_process';

export class UsbDriveMonitor {
    constructor(protected device: string) {}

    checkUsbDrive = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            exec(`df -Th | grep ${this.device}`, function callback(error, stdout, stderr) {
                if (error) {
                    resolve('');
                    return;
                }
                resolve(stdout);
            });
        });
    };

    eject = () => {
        console.log('UsbDriveMonitor eject()');
        const p = new Promise((resolve, reject) => {
            exec(`eject /dev/${this.device}`, function callback(error, stdout, stderr) {
                if (error) {
                    resolve(error);
                    return;
                }
                resolve(stdout);
            });
        });
        p.then((msg) => {
            return new Promise((resolve, reject) => {
                exec(
                    `udisksctl power-off -b /dev/${this.device}`,
                    function callback(error, stdout, stderr) {
                        if (error) {
                            resolve(error);
                            return;
                        }
                        resolve(stdout);
                    }
                );
            });
        });
    };
}
