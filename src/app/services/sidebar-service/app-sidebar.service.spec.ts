import { AppSidebarService } from './app-sidebar.service';

describe('Angular App Sidebar Service', () => {

    let service: AppSidebarService;

    beforeEach(() => {
        service = new AppSidebarService();
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

    it('set should set value in sidebar', () => {
        service.set('value', 0);
        const value = service.get('value');
        expect(value).toBe(0);
    });

});
