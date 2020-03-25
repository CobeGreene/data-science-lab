import { AlgorithmServiceModel } from "./algorithm.sm";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { AlgorithmDataService } from "../../data-services/algorithm-data-service";
import { TrackerDataService } from "../../data-services/tracker-data-service/tracker.data-service";
import { TestReportDataService } from "../../data-services/test-report-data-service";
import { AlgorithmEvents } from "../../../../shared/events";



describe('Electron Algorithm Service Model', () => {
    let serviceModel: AlgorithmServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let algorithmService: AlgorithmDataService;
    let trackerService: TrackerDataService;
    let reportService: TestReportDataService;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.AlgorithmDataService) {
                return algorithmService;
            } else if (type === SERVICE_TYPES.TrackerDataService) {
                return trackerService;
            } else if (type === SERVICE_TYPES.TestReportDataService) {
                return reportService;
            }
            throw new Error(`Couldn't resolve type ${type}`);
        });
        
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        algorithmService = jasmine.createSpyObj('AlgorithmDataService', 
            ['allView', 'view', 'delete', 'start', 'stop', 'update', 'load', 'save', 'all', 'deleteByExperiment', 'get']);
        trackerService = jasmine.createSpyObj('TrackerDataService', ['has', 'delete', 'load', 'save', 'allView']);
        reportService = jasmine.createSpyObj('ReportDataService', ['save', 'load', 'deleteByAlgorithm', 'all']);
        serviceModel = new AlgorithmServiceModel(serviceContainer, producer);
    });

    it('all should call producer send with views', () => {
        (algorithmService.allView as jasmine.Spy).and.returnValue([]);
        serviceModel.all();
        expect(producer.send).toHaveBeenCalled();
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.All, []);
        expect(algorithmService.allView).toHaveBeenCalledTimes(1);
        expect(algorithmService.all).toHaveBeenCalledTimes(0);
    });

    it('change should call update for algorithm', () => {
        (algorithmService.view as jasmine.Spy).and.returnValue({});
        serviceModel.change(1);
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Update, {});
        expect(algorithmService.view).toHaveBeenCalledTimes(1);
        expect(algorithmService.view).toHaveBeenCalledWith(1);
    });

    it('delete should call service with delete', async () => {
        (algorithmService.delete as jasmine.Spy).and.returnValue(new Promise((resolve) => {
            resolve();
        }));
        await serviceModel.delete(1);
        expect(algorithmService.delete).toHaveBeenCalledTimes(1);
        expect(algorithmService.delete).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Delete, 1);
    });

    it('delete by experiment should producer multiple service with tracker', async () => {
        (algorithmService.deleteByExperiment as jasmine.Spy).and.returnValue(new Promise((resolve) => {
            resolve([1]);
        }));
        (trackerService.has as jasmine.Spy).and.returnValue(true);

        await serviceModel.deleteByExperiment(1);

        expect(trackerService.delete).toHaveBeenCalledTimes(1);
        expect(reportService.deleteByAlgorithm).toHaveBeenCalledTimes(1);
        expect(algorithmService.deleteByExperiment).toHaveBeenCalledTimes(1);
        expect(algorithmService.allView).toHaveBeenCalledTimes(1);
        expect(trackerService.allView).toHaveBeenCalledTimes(1);
        expect(reportService.all).toHaveBeenCalledTimes(1);
    });

    it('delete by experiment should not delete tracker', async () => {
        (algorithmService.deleteByExperiment as jasmine.Spy).and.returnValue(new Promise((resolve) => {
            resolve([1]);
        }));
        (trackerService.has as jasmine.Spy).and.returnValue(false);

        await serviceModel.deleteByExperiment(1);

        expect(trackerService.delete).toHaveBeenCalledTimes(0);
        expect(reportService.deleteByAlgorithm).toHaveBeenCalledTimes(1);
        expect(algorithmService.deleteByExperiment).toHaveBeenCalledTimes(1);
        expect(algorithmService.allView).toHaveBeenCalledTimes(1);
        expect(trackerService.allView).toHaveBeenCalledTimes(1);
        expect(reportService.all).toHaveBeenCalledTimes(1);
    });

    it('start should call algorithm service', () => {
        (algorithmService.view as jasmine.Spy).and.returnValue({});
        serviceModel.start(1);
        expect(algorithmService.start).toHaveBeenCalledTimes(1);
        expect(algorithmService.view).toHaveBeenCalledTimes(1);
        expect(algorithmService.view).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Update, {});
    });
    
    it('stop should call algorithm service', () => {
        (algorithmService.view as jasmine.Spy).and.returnValue({});
        serviceModel.stop(1);
        expect(algorithmService.stop).toHaveBeenCalledTimes(1);
        expect(algorithmService.view).toHaveBeenCalledTimes(1);
        expect(algorithmService.view).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Update, {});
    });

    it('update should stop and restart training', () => {
        (algorithmService.get as jasmine.Spy).and.returnValue({
            iterationTime: 200,
            isTraining: true,
            name: 'Name'
        });
        (algorithmService.view as jasmine.Spy).and.returnValue({});
        serviceModel.update(1, 'New Name', 100);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Update, {});
        expect(algorithmService.stop).toHaveBeenCalled();
        expect(algorithmService.stop).toHaveBeenCalledBefore(algorithmService.start as jasmine.Spy);
        expect(algorithmService.update).toHaveBeenCalledBefore(algorithmService.start as jasmine.Spy);
        expect(algorithmService.update).toHaveBeenCalledWith({
            iterationTime: 100,
            isTraining: true,
            name: 'New Name'
        });
        expect(algorithmService.start).toHaveBeenCalledTimes(1);
    });

    it('update should not stop training if time is same', () => {
        (algorithmService.get as jasmine.Spy).and.returnValue({
            iterationTime: 200,
            isTraining: true,
            name: 'Name'
        });
        (algorithmService.view as jasmine.Spy).and.returnValue({});
        serviceModel.update(1, 'New Name', 200);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Update, {});
        expect(algorithmService.stop).toHaveBeenCalledTimes(0);
        expect(algorithmService.update).toHaveBeenCalledWith({
            iterationTime: 200,
            isTraining: true,
            name: 'New Name'
        });
        expect(algorithmService.start).toHaveBeenCalledTimes(0);
    });

    it('update should not stop training if not training', () => {
        (algorithmService.get as jasmine.Spy).and.returnValue({
            iterationTime: 200,
            isTraining: false,
            name: 'Name'
        });
        (algorithmService.view as jasmine.Spy).and.returnValue({});
        serviceModel.update(1, 'New Name', 100);

        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(AlgorithmEvents.Update, {});
        expect(algorithmService.stop).toHaveBeenCalledTimes(0);
        expect(algorithmService.update).toHaveBeenCalledWith({
            iterationTime: 100,
            isTraining: false,
            name: 'New Name'
        });
        expect(algorithmService.start).toHaveBeenCalledTimes(0);
    });

    it('load should call tracker and report services', async () => {
        (algorithmService.load as jasmine.Spy).and.returnValue(new Promise((resolve) => {
            resolve();
        }));
        (algorithmService.all as jasmine.Spy).and.returnValue([
            { id: 0 }, { id: 1 }
        ]);
        await serviceModel.load(1);
        expect(trackerService.load).toHaveBeenCalledTimes(2);
        expect(reportService.load).toHaveBeenCalledTimes(2);
    });

    it('save should call tracker and report services', () => {
        (algorithmService.all as jasmine.Spy).and.returnValue([
            { id: 0 }, { id: 1 }
        ]);
        serviceModel.save(1);
        expect(trackerService.save).toHaveBeenCalledTimes(2);
        expect(reportService.save).toHaveBeenCalledTimes(2);
        expect(algorithmService.save).toHaveBeenCalledTimes(1);
        expect(algorithmService.save).toHaveBeenCalledWith(1);
    });

});
