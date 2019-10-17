import { MockIpService } from '../../../../../shared/services/mock-ip.service';

describe('Electron Mock Ip Service Tests', () => {
    let ipService: MockIpService;
    const channel = 'channel';
    const message = 'message';

    beforeAll(() => {
        ipService = new MockIpService();
    });

    it('once and send should send message to listener on channel', (done) => {
        ipService.once(channel, (_event, arg) => {
            const recieve = arg[0];
            expect(recieve).toEqual(message);
            done();
        });
        ipService.send(channel, message);
    });

    it('on and send should send message to listener on channel', (done) => {
        ipService.on(channel, (_event, arg) => {
            const recieve = arg[0];
            expect(recieve).toEqual(message);
            done();
        });
        ipService.send(channel, message);
    });

    it('on and send should reieve two message to listener on channel', (done) => {
        let happen = false;
        ipService.on(channel, (_event, arg) => {
            const recieve = arg[0];
            if (happen) {
                expect(recieve).toEqual(message);
                done();
            } else {
                happen = true;
                ipService.send(channel, message);
            }
        });
        ipService.send(channel, message);
    });

    it('send should send without any listeners', () => {
        ipService.send(channel, message);
        expect().nothing();
    });

    it('remove listener should not recieve after removing from listeners', (done) => {
        const listener = (_event) => {
            done.fail('shouldn\'t get any message');
        };
        ipService.on(channel, listener);
        ipService.removeListener(channel, listener);
        ipService.send(channel, message);
        done();
    });

    it('remove listeners should not recieve after removing all from listeners', (done) => {
        ipService.on(channel, (_event) => {
            done.fail('should\'t get any message');
        });
        ipService.removeAllListeners(channel);
        ipService.send(channel, message);
        done();
    });

    it('remove listener should not recieve after removing from once listeners', (done) => {
        const listener = (_event) => {
            done.fail('shouldn\'t get any message');
        };
        ipService.once(channel, listener);
        ipService.removeListener(channel, listener);
        ipService.send(channel, message);
        done();
    });

    it('remove listeners should not recieve after removing all from once listeners', (done) => {
        ipService.once(channel, (_event) => {
            done.fail('should\'t get any message');
        });
        ipService.removeAllListeners(channel);
        ipService.send(channel, message);
        done();
    });

});
