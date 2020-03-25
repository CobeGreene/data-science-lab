import { TrackerServiceModel } from "./tracker.sm";
import { TrackerDataService } from "../../data-services/tracker-data-service";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { TrackerEvents } from "../../../../shared/events";


describe('Electron Tracker Service Model', () => {
    let serviceModel: TrackerServiceModel;
    let trackerService: TrackerDataService;
    let serviceContainer: ServiceContainer;
    let producer: Producer;

    beforeAll(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.TrackerDataService) {
                return trackerService;
            }
            throw new Error(`Couldn't resolve type ${type}`);
        });
    });

    beforeEach(() => {
        producer = jasmine.createSpyObj('Producer', ['send']);
        trackerService = jasmine.createSpyObj('TrackerDataService', ['allView', 'view']);
        serviceModel = new TrackerServiceModel(serviceContainer, producer); 
    });

    it('all should call producer', () => {
        (trackerService.allView as jasmine.Spy).and.returnValue([]);
        serviceModel.all();
        expect(producer.send).toHaveBeenCalledWith(TrackerEvents.All, []);
    });
    
    it('change should call producer', () => {
        (trackerService.view as jasmine.Spy).and.returnValue({});
        serviceModel.change(1);
        expect(producer.send).toHaveBeenCalledWith(TrackerEvents.Update, {});
        expect(trackerService.view).toHaveBeenCalledWith(1);
    });
    
});


