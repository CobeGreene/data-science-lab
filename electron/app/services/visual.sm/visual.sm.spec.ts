import { VisualServiceModel } from "./visual.sm";
import { VisualDataService } from "../../data-services/visual-data-service";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { VisualEvents } from "../../../../shared/events";


describe('Electron Visual Service Model', () => {
    let serviceModel: VisualServiceModel;
    let visualService: VisualDataService;
    let serviceContainer: ServiceContainer;
    let producer: Producer;

    
    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.VisualDataService) {
                return visualService;
            } else if (type === SERVICE_TYPES.BrowserDataService) {
                return jasmine.createSpyObj('BrowserDataService', ['create']);
            }
            throw new Error(`Couldn't resolve type ${type}`);
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        visualService = jasmine.createSpyObj('VisualDataService', ['all', 'delete', 'load', 'save', 'get', 'update', 'deleteByExperiment']);
        serviceModel = new VisualServiceModel(serviceContainer, producer); 
    });

    it('all should call producer', () => {
        (visualService.all as jasmine.Spy).and.returnValue([]);
        serviceModel.all();
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(VisualEvents.All, []);
    });

    it('delete should call producer and service', () => {
        serviceModel.delete(1);
        expect(visualService.delete).toHaveBeenCalledTimes(1);
        expect(visualService.delete).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(VisualEvents.Delete, 1);
    });
    
    it('load should call producer and service', () => {
        (visualService.all as jasmine.Spy).and.returnValue([]);
        serviceModel.load(1);
        expect(visualService.load).toHaveBeenCalledTimes(1);
        expect(visualService.load).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledWith(VisualEvents.All, []);
    });

    it('save should call service', () => {
        serviceModel.save(1);
        expect(visualService.save).toHaveBeenCalledTimes(1);
        expect(visualService.save).toHaveBeenCalledWith(1);
    });

    it('resize should update visual', () => {
        (visualService.get as jasmine.Spy).and.returnValue({
            id: 0,
            width: 20,
            height: 40
        });
        serviceModel.resize(1, 30, 50);
        expect(visualService.get).toHaveBeenCalledWith(1);
        expect(visualService.update).toHaveBeenCalledTimes(1);
        expect(visualService.update).toHaveBeenCalledWith({
            id: 0,
            width: 30,
            height: 50
        });
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(VisualEvents.Update, {
            id: 0,
            width: 30,
            height: 50
        });
    });
    
    it('reposition should update visual', () => {
        (visualService.get as jasmine.Spy).and.returnValue({
            id: 0,
            top: 20,
            left: 40
        });
        serviceModel.reposition(1, 30, 50);
        expect(visualService.get).toHaveBeenCalledWith(1);
        expect(visualService.update).toHaveBeenCalledTimes(1);
        expect(visualService.update).toHaveBeenCalledWith({
            id: 0,
            top: 30,
            left: 50
        });
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(VisualEvents.Update, {
            id: 0,
            top: 30,
            left: 50
        });
    });

    it('delete by experiment should call delete for each id', () => {
        (visualService.deleteByExperiment as jasmine.Spy).and.returnValue([1, 2]);

        serviceModel.deleteByExperiment(1);
        expect(visualService.deleteByExperiment).toHaveBeenCalledTimes(1);
        expect(visualService.deleteByExperiment).toHaveBeenCalledWith(1);
        expect(producer.send).toHaveBeenCalledTimes(2);
    });
});