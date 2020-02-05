import { TestReportDataService } from './test-report.data-service';
import { TestReportViewModel } from '../../../../shared/view-models';

export class AppTestReportDataService implements TestReportDataService {
    private nextId: number;
    private vms: TestReportViewModel[];

    constructor() {
        this.vms = [];
        this.nextId = 1;
    }

    all(): TestReportViewModel[] {
        return this.vms;
    }

    create(vm: TestReportViewModel) {
        vm.id = this.nextId++;
        this.vms.push(vm);
        return vm;
    }

    read(id: number): TestReportViewModel {
        const find = this.vms.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find test report with id ${id}`);
    }

    delete(id: number) {
        const find = this.vms.findIndex((value) => {
            return value.id === id;
        });
        if (find < 0) {
            throw new Error(`Couldn't find test report with id ${id}`);
        }
        this.vms.splice(find, 1);
    }

    update(vm: TestReportViewModel) {
        const index = this.vms.findIndex((value) => {
            return value.id === vm.id;
        });
        if (index >= 0) {
            this.vms[index] = vm;
        } else {
            throw new Error(`Couldn't find test report with id ${vm.id}`);
        }
    }

    

}



