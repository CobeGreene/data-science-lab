

export interface ThemeDataService {
    configure(): void;
    current(): any;
    switch(choice: string): any;
}
