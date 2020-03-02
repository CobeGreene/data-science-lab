import { AppSessionDataService } from './app-session.data-service';
import { SERVICE_TYPES, ServiceContainer } from '../../service-container';
import { Session, SessionOptions, SessionState, SessionPlugin } from '../../../../shared/models';


describe('Electron App Session Data Service', () => {
    let dataService: AppSessionDataService;
    let serviceContainer: ServiceContainer;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        dataService = new AppSessionDataService(serviceContainer);
    });

    it('all should return 0', () => {
        expect(dataService.all().length).toBe(0);
    });

    it('post should return session with id 0', () => {
        const session = dataService.post({
            id: 0,
            isWaiting: false,
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });
        expect(session.id).toBe(1);
    });
    
    it('get should return session with id 1', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });

        const session = dataService.get(1);
        expect(session.keyId).toBe(0);
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
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });
        dataService.update({
            id: 1,
            isWaiting: false,
            keyId: 1,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });
        const session = dataService.get(1);
        expect(session.keyId).toBe(1);
    }); 

    it('all should equal 1 after post', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });

        expect(dataService.all().length).toBe(1);
    });

    it('delete should decrease session length', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });

        dataService.delete(1);

        expect(dataService.all().length).toBe(0);
    });

    it('delete should throw for session not found', () => {
        expect(() => {
            dataService.delete(1);
        }).toThrow();
    });


    it('reference should throw for not found', () => {
        expect(() => {
            dataService.reference(1, 'temp');
        }).toThrow();
    });

    it('reference should return value after created', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });

        dataService.reference(1, 'temp');

        expect(dataService.reference<string>(1)).toBe('temp');
    });

    it('reference should throw for get without any assignments', () => {
        dataService.post({
            id: 0,
            isWaiting: false,
            keyId: 0,
            sessionOptions: {
                currentRoute: '',
                newTab: false,
            },
            state: SessionState.Select,
        });
        expect(() => {
            dataService.reference(1);
        }).toThrow();
    });




});


