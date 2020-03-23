import { AppTestReportSessionDataService } from "./app-test-report-session.data-service";
import { ServiceContainer } from "../../service-container";
import { Plugin } from "../../../../shared/models";

describe('Electron App Test Report Session Data Service', () => {
    let dataService: AppTestReportSessionDataService;
    let serviceContainer: ServiceContainer;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        dataService = new AppTestReportSessionDataService(serviceContainer);
    });

    
    it('all should return 0', () => {
        expect(dataService.all().length).toBe(0);
    });

    it('post should return session with id 0', () => {
        const session = dataService.post({
            id: 0,
            isWaiting: false,
            algorithmId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: '',
            plugin: {} as Plugin,
            inputs: []
        });
        expect(session.id).toBe(1);
    });
    
    it('get should return session with id 1', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            algorithmId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: '',
            plugin: {} as Plugin,
            inputs: []
        });

        const session = dataService.get(1);
        expect(session.algorithmId).toBe(0);
    });

    it('get should throw error', () => {
        expect(() => {
            const session = dataService.get(1);
        }).toThrow();
    });

    it('update should return session with id 1', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            algorithmId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: '',
            plugin: {} as Plugin,
            inputs: []
        });
        dataService.update({
            id: 1,
            isWaiting: false,
            algorithmId: 1,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: '',
            plugin: {} as Plugin,
            inputs: []
        });
        const session = dataService.get(1);
        expect(session.algorithmId).toBe(1);
    }); 

    it('all should equal 1 after post', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            algorithmId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: '',
            plugin: {} as Plugin,
            inputs: []
        });

        expect(dataService.all().length).toBe(1);
    });

    it('delete should decrease session length', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            algorithmId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: '',
            plugin: {} as Plugin,
            inputs: []
        });

        dataService.delete(1);

        expect(dataService.all().length).toBe(0);
    });

    it('delete should throw for session not found', () => {
        expect(() => {
            dataService.delete(1);
        }).toThrow();
    });
});

