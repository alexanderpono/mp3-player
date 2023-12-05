import { PlayerController } from './PlayerController';
import { FileStorageApi } from './ports/FileStorageApi';
import { WsClient } from './ports/WsClient';
import { castPartialTo } from './testFramework/castPartialTo';

test('1+1', () => {
    const ws = castPartialTo<WsClient>({});
    const fileStorage = castPartialTo<FileStorageApi>({});
    const ctrl = new PlayerController(ws, fileStorage);
    expect(1 + 1).toBe(2);
});
