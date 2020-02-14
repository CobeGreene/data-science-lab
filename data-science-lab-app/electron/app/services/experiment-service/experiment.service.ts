
export interface ExperimentService {
    all(): void;
    create(): void;
    load(id: number): void;
    save(id: number): void;
}
