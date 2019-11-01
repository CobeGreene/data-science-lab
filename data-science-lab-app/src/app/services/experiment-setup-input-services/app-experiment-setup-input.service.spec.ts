import { AppExperimentSetupInputService } from './app-experiment-setup-input.service';
import { ExperimentsEvents } from '../../../../shared/events';
import { MockIpcService } from '../../../../shared/services';

describe('Angular App Experiment Setup Fetch Service Tests', () => {
    let experimentService: AppExperimentSetupInputService;
    let ipcService: MockIpcService;

    beforeAll(() => {
        ipcService = new MockIpcService();
    });

    beforeEach(() => {
        experimentService = new AppExperimentSetupInputService(ipcService);
    });

    afterEach(() => {
        ipcService.removeListenersFromAllChannels();
    });

    it('execute command should send command event', (done) => {
        ipcService.on(ExperimentsEvents.ExecuteCommandEvent, (event, args: any[]) => {
            expect(args[0] as number).toBe(1);
            expect(args[1] as string).toBe('cmd');
            done();
        });
        experimentService.executeCommand(1, 'cmd');
    });

    it('submit should send submit event', (done) => {
        ipcService.on(ExperimentsEvents.SubmitEvent, (event, args: any[]) => {
            expect(args[0] as number).toBe(1);
            done();
        });
        experimentService.submit(1);
    });

});
