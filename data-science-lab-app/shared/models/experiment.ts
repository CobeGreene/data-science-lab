export enum ExperimentState {
    Unloaded,
    Current,
    Unsaved,
    Saving
}

export interface Experiment {
    id: number;
    title: string;
    description?: string;
    created: Date;
    state: ExperimentState;
}
