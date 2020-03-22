import { AppWorkspaceService } from './app-workspace.service';

describe('Angular App Workspace Service', () => {
    let service: AppWorkspaceService;

    beforeEach(() => {
        service = new AppWorkspaceService();
    });

    it('get should return default value', () => {
        const value = service.get('value', 1);
        expect(value).toBe(1);
    });

    it('get should throw when no default provided', () => {
        expect(() => {
            service.get('value');
        }).toThrowError();
    });

    it('set should set value in workspace', () => {
        service.set('value', 0);
        const value = service.get('value');
        expect(value).toBe(0);
    });


});

