export interface Plugin {
    name: string;
    className: string;
    description: string;
    type: string;
    packageName?: string;
}
