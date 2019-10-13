import { MockPluginService } from './mock_plugin.service';
import { Plugin } from '../../../../shared/models/plugin';

describe('MockPluginService', () => {
    it ('should create with no plugins', (done) => {
        const service = new MockPluginService();
        service.all().then((value: Plugin[]) => {
            expect(value.length).toBe(0);
            done();
        }).catch((error) => {
            done.fail(error);
        });
    });
});
