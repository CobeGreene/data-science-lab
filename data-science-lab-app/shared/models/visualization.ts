export class Visualization {
    public id: number;
    public label: string;
    public experimentId: number;
    public visual: string;

    constructor(visualization: {
        id: number,
        label: string,
        experimentId: number,
        visual: string
    }) {
        this.id = visualization.id;
        this.label = visualization.label;
        this.experimentId = visualization.experimentId;
        this.visual = visualization.visual;
    }
}
