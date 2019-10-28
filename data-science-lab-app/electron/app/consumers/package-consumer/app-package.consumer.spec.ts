import { MockIpcService } from '../../../../shared/services';
import { PackagesEvents } from '../../../../shared/events';
import { AppPackageConsumer } from './app-package.consumer';
import { MockPackageService } from '../../services';


describe('Electron App Package Consumer Tests', () => {
    let ipcService: MockIpcService;
    let appPackageConsumer: AppPackageConsumer;
    let mockPackageService: MockPackageService;

    beforeAll(() => {
        ipcService = new MockIpcService();
        mockPackageService = new MockPackageService();
        appPackageConsumer = new AppPackageConsumer(mockPackageService, ipcService);
        appPackageConsumer.initialize();
    });

    beforeEach(() => {
        mockPackageService.all = () => { };
        mockPackageService.install = (_) => { };
        mockPackageService.uninstall = (_) => { };
    });

    it('get all event should call all on package service', (done) => {
        mockPackageService.all = () => {
            done();
        };
        ipcService.send(PackagesEvents.GetAllEvent);
    });

    it('install event should call install on package service', (done) => {
        mockPackageService.install = (name: string) => {
            expect(name).toEqual('name');
            done();
        };
        ipcService.send(PackagesEvents.InstallEvent, 'name');
    });

    it('install event should throw error on package service', () => {
        expect(() => {
            ipcService.send(PackagesEvents.InstallEvent);
        }).toThrowError();
    });
    
    it('uninstall event should call uninstall on package service', (done) => {
        mockPackageService.uninstall = (name: string) => {
            expect(name).toEqual('name');
            done();
        };
        ipcService.send(PackagesEvents.UninstallEvent, 'name');
    });

    it('uninstall event should throw error on package service', () => {
        expect(() => {
            ipcService.send(PackagesEvents.UninstallEvent);
        }).toThrowError();
    });



});
