import { exec } from 'child_process';
import { UsbDriveMonitor } from './UsbDriveMonitor';

export class UsbDriveMonitorWin extends UsbDriveMonitor {
    checkUsbDrive = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            exec(`win\\checkdrive.bat ${this.device}`, (error, stdout, stderr) => {
                if (error) {
                    resolve('');
                    return;
                }
                if (stdout.trim() === 'IT EXISTS') {
                    resolve(this.device);
                } else {
                    resolve('');
                }
            });
        });
    };

    eject = () => {
        console.log('UsbDriveMonitorWin eject()');
        return new Promise((resolve, reject) => {
            exec(`cscript win\\eject.js ${this.device}`, function callback(error, stdout, stderr) {
                if (error) {
                    resolve(error);
                    return;
                }
                resolve(stdout);
            });
        });
    };
}
