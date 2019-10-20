import { MockSettingService } from './mock-setting.service';

describe('Electron Mock Setting Service Tests', () => {
    let settings: MockSettingService;

    beforeEach(() => {
        settings = new MockSettingService();
    });

    it('has should return false for empty settings', () => {
        expect(settings.has('not-found')).toBeFalsy();
    });

    it('set should has property after set', () => {
        settings.set('obj', 5);
        expect(settings.has('obj')).toBeTruthy();
    });

    it('get should return number', () => {
        settings.set('obj', 5);
        expect(settings.get<number>('obj')).toBe(5);
    });

    it('get should return default value for non-existant obj', () => {
        expect(settings.get<number>('obj', 5)).toBe(5);
    });

    it('get should return value not default for existant obj', () => {
        settings.set('obj', 1);
        expect(settings.get<number>('obj', 5)).toBe(1);
    });

    it('get should throw when non-default for non-existant obj', () => {
        expect(() => {
            settings.get<number>('obj');
        }).toThrowError();
    });
    
});

