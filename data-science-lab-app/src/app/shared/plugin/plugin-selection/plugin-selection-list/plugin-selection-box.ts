export class PluginSelectionBox {

    constructor(public name: string, public elements: HTMLElement[], public color?: string) {

    }

    static connectedPoints(lhs: { x: number, y: number }, rhs: { x: number, y: number }) {
        return (Math.abs(lhs.y - rhs.y) <= 1 && Math.abs(lhs.x - rhs.x) <= 1);
    }

    static elementDimension(element: HTMLElement): { top: number, left: number, width: number, height: number } {
        const top = element.offsetTop as number;
        const left = element.offsetLeft as number;
        const height = element.offsetHeight as number;
        const width = element.offsetWidth as number;
        return { top, left, height, width };
    }

    static points(element: HTMLElement): {
        topLeft: { x: number, y: number },
        topRight: { x: number, y: number },
        bottomLeft: { x: number, y: number },
        bottomRight: { x: number, y: number }
    } {
        const { top, left, width, height } = PluginSelectionBox.elementDimension(element);
        return {
            topLeft: { x: left, y: top },
            topRight: { x: left + width, y: top },
            bottomLeft: { x: left, y: top + height },
            bottomRight: { x: left + width, y: top + height }
        };
    }

    dimension(): { top: number, left: number, width: number, height: number } {
        if (this.elements.length === 0) {
            return { top: 0, left: 0, width: 0, height: 0 };
        }
        const dim = PluginSelectionBox.points(this.elements[0]);
        const topLeft = dim.topLeft;
        const bottomRight = dim.bottomRight;

        this.elements.forEach((element) => {
            const elementDim = PluginSelectionBox.points(element);
            const newTopLeft = elementDim.topLeft;
            const newBottomRight = elementDim.bottomRight;

            if (newTopLeft.y < topLeft.y) {
                topLeft.y = newTopLeft.y;
            }
            if (newTopLeft.x < topLeft.x) {
                topLeft.x = newTopLeft.x;
            }
            if (bottomRight.x < newBottomRight.x) {
                bottomRight.x = newBottomRight.x;
            }
            if (bottomRight.y < newBottomRight.y) {
                bottomRight.y = newBottomRight.y;
            }
        });
        return { top: topLeft.y, left: topLeft.x, width: bottomRight.x - topLeft.x, height: bottomRight.y - topLeft.y };
    }

    connected(rhs: PluginSelectionBox): boolean {
        let connected = false;
        this.elements.forEach((lhsElement) => {
            rhs.elements.forEach((rhsElement) => {
                connected = connected || this.connectedToRight(lhsElement, rhsElement) || this.connectedToRight(rhsElement, lhsElement);
            });
        });

        return connected;
    }

    connectedToRight(lhs: HTMLElement, rhs: HTMLElement): boolean {
        const lhsPoints = PluginSelectionBox.points(lhs);
        const rhsPoints = PluginSelectionBox.points(rhs);

        return PluginSelectionBox.connectedPoints(lhsPoints.topRight, rhsPoints.topLeft) ||
            PluginSelectionBox.connectedPoints(lhsPoints.bottomLeft, rhsPoints.topLeft);
    }
}
