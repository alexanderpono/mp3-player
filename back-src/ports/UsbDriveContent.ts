import { exec } from 'child_process';

export class UsbDriveContent {
    constructor() {}

    getSubtreeInfo = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            return 'subtree info';
        });
    };
}
