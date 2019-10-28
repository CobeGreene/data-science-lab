
export interface PackageService {
    all(): void;
    install(name: string): void;
    uninstall(name: string): void;
}
