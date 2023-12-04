import { Serializable, jsonProperty } from 'ts-serializable';
import { WsEvent } from './const';

export class WsMessage extends Serializable {
    @jsonProperty(String)
    public event = WsEvent.DEFAULT;
}
export const defaultWsMessage = new WsMessage().fromJSON({});
