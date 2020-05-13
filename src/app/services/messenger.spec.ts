import { Messenger } from './messenger';
import * as Events from '../../../shared/events';
import { IpcService } from '../../../shared/services';

describe('Angular Messenger Tests', () => {
    let messenger: Messenger;
    let ipc: IpcService;

    beforeEach(() => { 
        ipc = jasmine.createSpyObj('IpcService', ['send', 'on', 'removeListener']);
        messenger = new Messenger(ipc);
    });

    it('publish should call send with arguments', () => {
        messenger.publish('call', 1, "abc");
        expect(ipc.send).toHaveBeenCalledTimes(1);
        expect(ipc.send).toHaveBeenCalledWith(`call${Events.Deliminator}${Events.Event}`, 1, "abc");
    });

    
    it('subscribe should call on with arguments', () => {
        const myFunc = () => {};
        messenger.subscribe('call', myFunc);
        expect(ipc.on).toHaveBeenCalledTimes(1);
        expect(ipc.on).toHaveBeenCalledWith(`call${Events.Deliminator}${Events.Listener}`, myFunc);
    });
    
    it('unsubscribe should call removeListener with arguments', () => {
        const myFunc = () => {};
        messenger.unsubscribe('call', myFunc);
        expect(ipc.removeListener).toHaveBeenCalledTimes(1);
        expect(ipc.removeListener).toHaveBeenCalledWith(`call${Events.Deliminator}${Events.Listener}`, myFunc);
    });


})



