

export class AlgorithmViewModel {
    public id: number;
    public iteration: number;
    public hasStarted: boolean;
    public experimentId: number;

    constructor(vm: {
        id: number,
        experimentId: number,
        iteration?: number,
        hasStarted?: boolean,
    }) {
        this.id = vm.id;
        this.experimentId = vm.experimentId;
        this.iteration = vm.iteration || 0;
        this.hasStarted = vm.hasStarted || false;
    }
}
