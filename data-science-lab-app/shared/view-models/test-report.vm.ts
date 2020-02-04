

export class TestReportViewModel {
    algorithmId: number;
    correct: number;
    total: number;

    constructor(vm: {
        algorithmId: number,
        correct: number,
        total: number,
    }) {
        this.algorithmId = vm.algorithmId;
        this.correct = vm.correct;
        this.total = vm.total;
    }
} 
