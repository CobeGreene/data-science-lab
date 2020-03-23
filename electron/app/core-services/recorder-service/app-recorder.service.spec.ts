import { AppRecorderService } from './app-recorder.service';
import { Producer } from '../../pipeline';
import { TrackerDataService } from '../../data-services/tracker-data-service/tracker.data-service';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { TrackerEvents } from '../../../../shared/events';


describe('ELectron App Recorder Service', () => {
    let recorderService: AppRecorderService;
    let producer: Producer;
    let trackerDataService: TrackerDataService;
    let serviceContainer: ServiceContainer;

    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.Producer) {
                return producer;
            } else if (type === SERVICE_TYPES.TrackerDataService) {
                return trackerDataService;
            }
            throw new Error(`Couldn't resolve type ${type}`);
        });
        trackerDataService = jasmine.createSpyObj('TrackerDataService', ['has', 'create', 'push']);
        producer = jasmine.createSpyObj('Producer', ['send']);

        recorderService = new AppRecorderService(serviceContainer, 1, 1);
    });

    it('record should create a new tracker if none exist', () => {
        (trackerDataService.has as jasmine.Spy).and.returnValue(false);
        recorderService.record([]);
        expect(trackerDataService.create).toHaveBeenCalledTimes(1);
        expect(trackerDataService.create).toHaveBeenCalledBefore(trackerDataService.push as jasmine.Spy);
        expect(trackerDataService.push).toHaveBeenCalledTimes(1);
    });

    it('record should not call create if exist', () => {
        (trackerDataService.has as jasmine.Spy).and.returnValue(true);
        recorderService.record([]);
        expect(trackerDataService.create).toHaveBeenCalledTimes(0);
        expect(trackerDataService.push).toHaveBeenCalledTimes(1);
    });

    it('record should tell producer', (done) => {
        (producer.send as jasmine.Spy).and.callFake((event, id) => {
            expect(event).toBe(TrackerEvents.Change);
            expect(id).toBe(1);
            done();
        });
        (trackerDataService.has as jasmine.Spy).and.returnValue(true);
        recorderService.record([]);
    });




});
