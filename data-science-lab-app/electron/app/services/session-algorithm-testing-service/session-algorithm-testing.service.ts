

export interface SessionAlgorithmTestingService {
    all(): void;
    request(id: number, dataGroupId: number);
    startTest(id: number, inputs: { [id: string]: number[]; }, output: { [id: string]: number[]; }): void;   
}

