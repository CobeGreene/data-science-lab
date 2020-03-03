import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { DatasetServiceModel } from './dataset.sm';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { DatasetEvents } from '../../../../shared/events';



describe('Elecron Dataset Service Model', () => {
    let serviceModel: DatasetServiceModel;
    let serviceContainer: ServiceContainer;
    let datasetService: DatasetDataService;
    let producer: Producer;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.DatasetDataService) {
                return datasetService;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        datasetService = jasmine.createSpyObj('DatasetDataService',
            ['delete', 'load', 'save', 'update', 'all', 'get', 'view', 'split', 'join']);
        serviceModel = new DatasetServiceModel(serviceContainer, producer);
    });

    it('all should call producer and data service', () => {
        serviceModel.all();

        expect(producer.send).toHaveBeenCalled();
        expect(datasetService.all).toHaveBeenCalled();
    });

    it('delete should call producer and data service', () => {
        serviceModel.delete(1);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(datasetService.delete).toHaveBeenCalledTimes(1);
    });

    it('rename should update the dataset with a new name', (done) => {
        (datasetService.get as jasmine.Spy).and.callFake(() => {
            return { id: 1, name: 'Name' };
        });
        (datasetService.update as jasmine.Spy).and.callFake((dataset) => {
            expect(dataset.id).toBe(1);
            expect(dataset.name).toBe('New');
            done();
        });
        serviceModel.rename(1, 'New');
    });

    it('rename should update with producer', (done) => {
        (producer.send as jasmine.Spy).and.callFake((event, dataset) => {
            expect(event).toBe(DatasetEvents.Update);
            expect(dataset.id).toBe(1);
            expect(dataset.name).toBe('View');
            done();
        });
        (datasetService.get as jasmine.Spy).and.callFake(() => {
            return { id: 1, name: 'Name' };
        });
        (datasetService.view as jasmine.Spy).and.callFake(() => {
            return { id: 1, name: 'View' };
        });

        serviceModel.rename(1, 'New');
    });

    it('load should call dataservice load once', () => {
        datasetService.load(1);

        expect(datasetService.load).toHaveBeenCalledTimes(1);
    });

    it('load should call producer with all', (done) => {
        (producer.send as jasmine.Spy).and.callFake((event, dataset) => {
            expect(event).toBe(DatasetEvents.All);
            done();
        });
        serviceModel.load(1);
    });

    it('save should call dataservice save', () => {
        serviceModel.save(1);
        expect(datasetService.save).toHaveBeenCalledTimes(1);
    });

    it('split should call dataservice split', () => {
        serviceModel.split(1, 30);
        expect(datasetService.split).toHaveBeenCalledTimes(1);
    });

    it('split should call producer created with new id', (done) => {
        (datasetService.split as jasmine.Spy).and.callFake(() => {
            return 2;
        });
        (datasetService.view as jasmine.Spy).and.callFake((id) => {
            return { id };
        });
        (producer.send as jasmine.Spy).and.callFake((event, dataset) => {
            if (event === DatasetEvents.Create) {
                expect(dataset.id).toBe(2);
                done();
            }
        });
        serviceModel.split(1, 30);
    });

    it('split should call producer update of previous id', (done) => {
        (datasetService.split as jasmine.Spy).and.callFake(() => {
            return 2;
        });
        (datasetService.view as jasmine.Spy).and.callFake((id) => {
            return { id };
        });
        (producer.send as jasmine.Spy).and.callFake((event, dataset) => {
            if (event === DatasetEvents.Update) {
                expect(dataset.id).toBe(1);
                done();
            }
        });
        serviceModel.split(1, 30);
    });

    it('join should call producer delete three times and update once', () => {
        (datasetService.join as jasmine.Spy).and.callFake(() => {
            return { updateId: 1, deletedIds: [2, 3, 4] };
        });
        serviceModel.join([1, 2, 3, 4]);
        expect(producer.send).toHaveBeenCalledTimes(4);
    });


});




