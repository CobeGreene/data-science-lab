import { RecorderService } from 'data-science-lab-core';

export interface AlgorithmRecorderService extends RecorderService {
    current(iteration: number): void;
}
