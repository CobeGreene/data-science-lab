export function getType(data: any): string {
    if (Array.isArray(data)) {
        return `${this.getType(data[0])}[]`;
    }
    return typeof data;
}