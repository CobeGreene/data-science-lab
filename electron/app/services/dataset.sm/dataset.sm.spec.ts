import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer } from '../../pipeline';
import { DatasetServiceModel } from './dataset.sm';
import { DatasetDataService } from '../../data-services/dataset-data-service';
import { DatasetEvents } from '../../../../shared/events';
import { DatasetObject } from '../../models';



describe('Electron Dataset Service Model', () => {
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
            ['delete', 'load', 'save', 'update', 'all', 'get', 'view', 'allView', 'split', 'join', 'deleteByExperiment', 'show']);
        serviceModel = new DatasetServiceModel(serviceContainer, producer);
    });

    it('all should call producer and data service', () => {
        (datasetService.allView as jasmine.Spy).and.returnValue([]);
        serviceModel.all();

        expect(producer.send).toHaveBeenCalled();
        expect(datasetService.allView).toHaveBeenCalled();
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
        (datasetService.all as jasmine.Spy).and.returnValue([]);
        datasetService.load(1);

        expect(datasetService.load).toHaveBeenCalledTimes(1);
    });

    it('load should call producer with all', (done) => {
        (datasetService.all as jasmine.Spy).and.returnValue([]);
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

    it('delete by experiment should call dataset service', () => {
        (datasetService.allView as jasmine.Spy).and.returnValue([]);
        serviceModel.deleteByExperiment(1);

        expect(datasetService.deleteByExperiment).toHaveBeenCalledTimes(1);
        expect(datasetService.deleteByExperiment).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(DatasetEvents.All, []);
    });

    it('show should call dataset service', () => {
        (datasetService.view as jasmine.Spy).and.returnValue({});

        serviceModel.show(1);
        expect(datasetService.show).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(DatasetEvents.Update, {});
    });

    it('rename feature should change feature name', () => {
        (datasetService.get as jasmine.Spy).and.returnValue({
            id: 1,
            name: 'Dataset',
            examples: 50,
            experimentId: 1,
            previewExamples: 5,
            features: [
                {
                    name: 'Feature 1',
                    type: 'number',
                    examples: []
                },
                {
                    name: 'Feature 2',
                    type: 'number',
                    examples: []
                },
                {
                    name: 'Feature 3',
                    type: 'number',
                    examples: []
                },
            ]
        } as DatasetObject);
        (datasetService.view as jasmine.Spy).and.returnValue({});

        serviceModel.renameFeature(1, 1, 'New Name');
        expect(datasetService.get).toHaveBeenCalledTimes(1);
        expect(datasetService.get).toHaveBeenCalledWith(1);
        expect(datasetService.update).toHaveBeenCalledTimes(1);
        expect(datasetService.update).toHaveBeenCalledWith({
            id: 1,
            name: 'Dataset',
            examples: 50,
            experimentId: 1,
            previewExamples: 5,
            features: [
                {
                    name: 'Feature 1',
                    type: 'number',
                    examples: []
                },
                {
                    name: 'New Name',
                    type: 'number',
                    examples: []
                },
                {
                    name: 'Feature 3',
                    type: 'number',
                    examples: []
                },
            ]
        });
        expect(datasetService.view).toHaveBeenCalledTimes(1);
        expect(datasetService.view).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(DatasetEvents.Update, {});
    });


});




