import { exec } from 'child_process';

export class UsbDriveMonitor {
    constructor(private device: string) {}

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
}
