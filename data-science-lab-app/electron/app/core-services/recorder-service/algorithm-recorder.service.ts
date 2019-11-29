import { RecorderService } from 'data-science-lab-core';


export interface AlgorithmRecorderService extends RecorderService {

    setAlgorithmId(id: number);
}
