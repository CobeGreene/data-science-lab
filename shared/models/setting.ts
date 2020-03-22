export interface Setting {
    key: string;
    title: string;
    default: any;
    description: string;
    value: any;
    choices?: string[];
    min?: number;
    max?: number;
}
