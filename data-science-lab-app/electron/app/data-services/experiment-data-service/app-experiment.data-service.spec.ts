import { AppExperimentDataService } from './app-experiment.data-service';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { SettingsContext } from '../../contexts/settings-context';
import { Experiment, ExperimentState } from '../../../../shared/models';


describe('Electron App Experiment Data Service', () => {
    let dataService: AppExperimentDataService;
    let serviceContainer: ServiceContainer;
    let context: SettingsContext;
    let original: Experiment[];

    beforeEach(() => {
        original = [
            {
                id: 1, created: new Date(),
                state: ExperimentState.Loaded,
                title: 'Title'
            }
        ];
        context = jasmine.createSpyObj('SettingsContext', ['get', 'set']);
        (context.get as jasmine.Spy).and.returnValue(original);

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
        dataService = new AppExperimentDataService(serviceContainer);
        dataService.configure();
    });

    it('should return 1 for all', () => {
        const experiments = dataService.all();
        expect(experiments.length).toBe(1);
    });

    it('should return experiment for get of 1', () => {
        const experiment = dataService.get(1);

        expect(experiment.title).toBe('Title');
        expect(experiment.state).toBe(ExperimentState.Unloaded);
    });

    it('should throw for get of 2', () => {
        expect(() => {
            dataService.get(2);
        }).toThrow();
    });

    it('should call context set with zero experiments after delete', (done) => {
        (context.set as jasmine.Spy).and.callFake((_key, value) => {
            expect(value.length).toBe(0);
            done();
        });
        dataService.delete(1);
    });

    it('should throw for delete of 2', () => {
        expect(() => {
            dataService.delete(2);
        }).toThrow();
    });

    it('should create for post with id of 2', () => {
        const experiment = dataService.post({
            id: 0,
            created: new Date(),
            state: ExperimentState.Loaded,
            title: 'New Title',
            description: 'Description'
        });
        expect(experiment.id).toBe(2);
    });

    it('should save for post', (done) => {
        (context.set as jasmine.Spy).and.callFake((_key, value) => {
            expect(value.length).toBe(2);
            done();
        });
        dataService.post({
            id: 0,
            created: new Date(),
            state: ExperimentState.Loaded,
            title: 'New Title',
            description: 'Description'
        }); 
    });
    
    it('should save for update', (done) => {
        (context.set as jasmine.Spy).and.callFake((_key, value) => {
            expect(value.length).toBe(1);
            done();
        });
        dataService.update({
            id: 1,
            created: new Date(),
            state: ExperimentState.Loaded,
            title: 'New Title',
            description: 'Description'
        }); 
    });

    it('should throw for update of id 2', () => {
        expect(() => {
            dataService.update({
                id: 2,
                created: new Date(),
                state: ExperimentState.Loaded,
                title: 'New Title',
                description: 'Description'
            }); 
        }).toThrow();
    });



});
