

export class TestReportViewModel {
    id: number;
    algorithmId: number;
    correct: number;
    total: number;

    constructor(vm: {
        id?: number,
        algorithmId: number,
        correct: number,
        total: number,
    }) {
        this.id = vm.id || 0;
        this.algorithmId = vm.algorithmId;
        this.correct = vm.correct;
        this.total = vm.total;
    }
} 
