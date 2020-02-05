
export interface AlgorithmService {
    all(): void;
    delete(id: number): void;
    start(id: number): void;
    stop(id: number): void;
}
