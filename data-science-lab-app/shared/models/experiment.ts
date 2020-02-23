export enum ExperimentState {
    Unloaded,
    Loaded,
}

export interface Experiment {
    id: number;
    title: string;
    description?: string;
    created: Date;
    state: ExperimentState;
}
