import { WS_SERVER_PORT } from '@config/const';
import { PlayerController } from './PlayerController';
import { WsClient } from './ports/WsClient';
import { FileStorageApi } from './ports/FileStorageApi';
import { APP_VERSION } from './PlayerController.types';

console.log('mp3 player', APP_VERSION);
document.title = 'mp3 player ' + APP_VERSION;

const wsClient = new WsClient(WS_SERVER_PORT);
const ctrl = new PlayerController(wsClient, new FileStorageApi()).go();
wsClient.setCtrl(ctrl);
