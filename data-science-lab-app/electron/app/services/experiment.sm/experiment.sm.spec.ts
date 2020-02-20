import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { ExperimentServiceModel } from './experiment.sm';
import { ExperimentEvents } from '../../../../shared/events';
import { ExperimentDataService } from '../../data-services/experiment-data-service';

describe('Electron Experiment Service Model', () => {

    let serviceModel: ExperimentServiceModel;
    let serviceContainer: ServiceContainer;
    let dataService: ExperimentDataService;
    let producer: Producer;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.ExperimentDataService) {
                return dataService;
            } 
            throw new Error(`Couldn't resolve type ${type}.`);
        });
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        dataService = jasmine.createSpyObj('ThemeDataService', ['all', 'post', 'get', 'update', 'delete']);
        serviceModel = new ExperimentServiceModel(serviceContainer, producer);
    });

    it('all should call producer and data service', () => {
        (producer.send as jasmine.Spy).and.returnValue(0);
        (dataService.all as jasmine.Spy).and.returnValue([]);

        serviceModel.all();
        expect(producer.send).toHaveBeenCalled();
        expect(dataService.all).toHaveBeenCalled();
    });

    it('create should call post with new id', (done) => {
        (dataService.post as jasmine.Spy).and.callFake((experiment) => {
            experiment.id = 3;
            return experiment;
        });
        (producer.send as jasmine.Spy).and.callFake((event, experiment) => {
            expect(event).toBe(ExperimentEvents.Create);
            expect(experiment.title).toBe('Title');
            expect(experiment.description).toBe('Desc');
            expect(experiment.id).toBe(3);
            done();
        });
        serviceModel.create('Title', 'Desc');
    });

    it('update should send update with new title', (done) => {
        (dataService.get as jasmine.Spy).and.returnValue({
            id: 3,
            title: 'Title',
            description: 'Desc',
        });
        (producer.send as jasmine.Spy).and.callFake((event, experiment) => {
            expect(event).toBe(ExperimentEvents.Update);
            expect(experiment.title).toBe('New Title');
            expect(experiment.description).toBe('New Desc');
            expect(experiment.id).toBe(3);
            done();
        });
        serviceModel.update(3, 'New Title', 'New Desc');
    });
    
    it('update should update data service with new title', (done) => {
        (dataService.get as jasmine.Spy).and.returnValue({
            id: 3,
            title: 'Title',
            description: 'Desc',
        });
        (dataService.update as jasmine.Spy).and.callFake((experiment) => {
            expect(experiment.title).toBe('New Title');
            expect(experiment.description).toBe('New Desc');
            expect(experiment.id).toBe(3);
            done();
        });
        serviceModel.update(3, 'New Title', 'New Desc');
    });

    it('delete should call producer delete with id', (done) => {
        (producer.send as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(ExperimentEvents.Delete);
            expect(id).toBe(3);
            done();
        });
        serviceModel.delete(3);
    });
    
    it('delete should call data service delete with id', (done) => {
        (dataService.delete as jasmine.Spy).and.callFake((id) => {
            expect(id).toBe(3);
            done();
        });
        serviceModel.delete(3);
        expect(dataService.delete).toHaveBeenCalledTimes(1);
    });

});
