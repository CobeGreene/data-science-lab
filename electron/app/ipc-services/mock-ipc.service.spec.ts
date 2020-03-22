import { MockIpcService } from '../../../shared/services';

describe('Electron Mock Ipc Service Tests', () => {
    let ipcService: MockIpcService;
    const channel = 'channel';
    const message = 'message';

    beforeAll(() => {
        ipcService = new MockIpcService();
    });

    it('once and send should send message to listener on channel', (done) => {
        ipcService.once(channel, (_event, recieve: string) => {
            expect(recieve).toEqual(message);
            done();
        });
        ipcService.send(channel, message);
    });

    it('on and send should send message to listener on channel', (done) => {
        ipcService.on(channel, (_event, recieve: string) => {
            expect(recieve).toEqual(message);
            done();
        });
        ipcService.send(channel, message);
    });

    it('on and send should reieve two message to listener on channel', (done) => {
        let happen = false;
        ipcService.on(channel, (_event, recieve) => {
            if (happen) {
                expect(recieve).toEqual(message);
                done();
            } else {
                happen = true;
                ipcService.send(channel, message);
            }
        });
        ipcService.send(channel, message);
    });

    it('send should send without any listeners', () => {
        ipcService.send(channel, message);
        expect().nothing();
    });

    it('remove listener should not recieve after removing from listeners', (done) => {
        const listener = (_event) => {
            done.fail('shouldn\'t get any message');
        };
        ipcService.on(channel, listener);
        ipcService.removeListener(channel, listener);
        ipcService.send(channel, message);
        done();
    });

    it('remove listeners should not recieve after removing all from listeners', (done) => {
        ipcService.on(channel, (_event) => {
            done.fail('should\'t get any message');
        });
        ipcService.removeAllListeners(channel);
        ipcService.send(channel, message);
        done();
    });

    it('remove listener should not recieve after removing from once listeners', (done) => {
        const listener = (_event) => {
            done.fail('shouldn\'t get any message');
        };
        ipcService.once(channel, listener);
        ipcService.removeListener(channel, listener);
        ipcService.send(channel, message);
        done();
    });

    it('remove listeners should not recieve after removing all from once listeners', (done) => {
        ipcService.once(channel, (_event) => {
            done.fail('should\'t get any message');
        });
        ipcService.removeAllListeners(channel);
        ipcService.send(channel, message);
        done();
    });

});
