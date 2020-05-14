import { TestReportDataService } from "../../data-services/test-report-data-service";
import { ServiceContainer, SERVICE_TYPES } from "../../service-container";
import { Producer } from "../../pipeline";
import { TestReportServiceModel } from "./test-report.sm";
import { TestReportEvents } from "../../../../shared/events";


describe('Electron Test Report Service Model', () => {
    let serviceModel: TestReportServiceModel;
    let serviceContainer: ServiceContainer;
    let producer: Producer;
    let reportService: TestReportDataService;
    
    beforeEach(() => {
        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.TestReportDataService) {
                return reportService;
            }
            throw new Error(`Couldn't resolve type ${type}`);
        });
        producer = jasmine.createSpyObj('Producer', ['send']);
        reportService = jasmine.createSpyObj('ReportDataService', ['get', 'update', 'delete', 'allView', 'show', 'view']);
        serviceModel = new TestReportServiceModel(serviceContainer, producer);
    });

    describe('all view', () => {

        it('should call all view', () => {
            (reportService.allView as jasmine.Spy).and.returnValue([]);
            serviceModel.all();
            expect(producer.send).toHaveBeenCalledWith(TestReportEvents.All, []);
        });
    });
    
    describe('rename', () => {

        it('should call and get update', () => {
            (reportService.get as jasmine.Spy).and.returnValue({id: 1, name: 'Name'});
            (reportService.view as jasmine.Spy).and.returnValue({id: 1, name: 'View'});
            serviceModel.rename(1, 'New Name');
            expect(producer.send).toHaveBeenCalledWith(TestReportEvents.Update, { id: 1, name: 'View'});
            expect(reportService.get).toHaveBeenCalledWith(1);
            expect(reportService.update).toHaveBeenCalledWith({ id: 1, name: 'New Name'});
        });
    })

    describe('delete', () => {

        it('should call delete service', () => {
            serviceModel.delete(1);
            expect(producer.send).toHaveBeenCalledWith(TestReportEvents.Delete, 1);
            expect(reportService.delete).toHaveBeenCalledTimes(1);
            expect(reportService.delete).toHaveBeenCalledWith(1);
        });
    });

    it('show should call dataset service', () => {
        (reportService.view as jasmine.Spy).and.returnValue({});

        serviceModel.show(1);
        expect(reportService.show).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledTimes(1);
        expect(producer.send).toHaveBeenCalledWith(TestReportEvents.Update, {});
    });
});