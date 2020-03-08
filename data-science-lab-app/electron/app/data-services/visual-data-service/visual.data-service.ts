import { Visual } from '../../../../shared/models';

export interface VisualDataService {
    configure(): void;
    all(): Visual[];
    // tslint:disable-next-line: unified-signatures
    all(experimentId: number): Visual[];
    get(id: number): Visual;
    post(visual: Visual): Visual;
    delete(id: number): void;
    deleteByExperiment(experimentId: number): number[];
    update(visual: Visual): void;
    load(experimentId: number): void;
    save(experimentId: number): void;
}
