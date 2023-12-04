import express from 'express';

export interface RestController {
    onRestGetRoot: (req, res) => void;
    onRestGetFolder: (req, res) => void;
    onRestGetRootFolder: (req, res) => void;
    onRestGetFile: (req, res) => void;
    onRestEject: (req, res) => void;
}
export class RestServer {
    private app = null;
    constructor(private port: number, private ctrl: RestController) {}

    run = () => {
        this.app = express();

        this.app.get('/', this.ctrl.onRestGetRoot);
        this.app.get('/folder', this.ctrl.onRestGetRootFolder);
        this.app.get('/folder/:id', this.ctrl.onRestGetFolder);
        this.app.get('/file/:id', this.ctrl.onRestGetFile);
        this.app.get('/eject', this.ctrl.onRestEject);

        this.app.listen(this.port);
    };
}
