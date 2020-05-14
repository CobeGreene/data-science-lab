import { Component, OnInit, Input } from '@angular/core';
import { PluginSelectionBox } from '../plugin-selection-box';

@Component({
  selector: 'app-plugin-selection-box',
  templateUrl: './plugin-selection-box.component.html',
  styleUrls: ['./plugin-selection-box.component.css']
})
export class PluginSelectionBoxComponent implements OnInit {

  
  private _box: PluginSelectionBox;

  @Input() set box(box: PluginSelectionBox) {
    this._box = box;
    const dim = this.box.dimension();
    this.top = dim.top;
    this.left = dim.left;
    this.width = dim.width;
    this.height = dim.height;
    this.path = this.createPath(this.createOuterPath(this.distinctCoords(this.outerCoordinatesOfBox())), dim);
  }

  get box(): PluginSelectionBox {
    return this._box;
  }

  @Input() id: number;

  top: number;
  left: number;
  width: number;
  height: number;
  path: string;


  constructor() { }

  ngOnInit() {
  }

  getViewBox() {
    return `0 0 ${this.width} ${this.height}`;
  }

  getPathId() {
    return `pluginPackageWrapper${this.id}`;
  }

  getTextPath() {
    return `#${this.getPathId()}`;
  }



  createPath(coords: { x: number, y: number }[], dim: { left: number, top: number }): string {
    let d = `M ${coords[0].x - dim.left}, ${coords[0].y - dim.top} `;
    coords.forEach((coord) => {
      d += `L ${coord.x - dim.left}, ${coord.y - dim.top} `;
    });
    return d;
  }

  distinctCoords(coords: { x: number, y: number }[]): { x: number, y: number }[] {
    return coords.filter((value, index, self) => self.findIndex((cmp) => {
      return PluginSelectionBox.connectedPoints(value, cmp);
    }) === index);
  }

  outerCoordinatesOfBox(): { x: number, y: number }[] {
    const coords: { x: number, y: number }[] = [];

    this.box.elements.map(element => PluginSelectionBox.points(element)).forEach(points => {
      coords.push(points.topLeft, points.topRight, points.bottomLeft, points.bottomRight);
    });

    const indicesToRemove: number[] = [];

    coords.forEach((value, index) => {
      let numOfBoxesAround = 0;
      this.box.elements.forEach((element) => {
        const points = PluginSelectionBox.points(element);

        if (PluginSelectionBox.connectedPoints(value, points.topLeft) ||
          PluginSelectionBox.connectedPoints(value, points.topRight) ||
          PluginSelectionBox.connectedPoints(value, points.bottomLeft) ||
          PluginSelectionBox.connectedPoints(value, points.bottomRight)) {
          numOfBoxesAround += 1;
        }
      });

      if (numOfBoxesAround >= 4) {
        indicesToRemove.push(index);
      }
    });

    indicesToRemove.sort((a, b) => b - a).forEach((index) => {
      coords.splice(index, 1);
    });

    return coords;
  }

  createOuterPath(coords: { x: number, y: number }[]): { x: number, y: number }[] {
    let ymin = coords[0].y;
    let xmin = coords[0].x;

    for (let i = 1; i < coords.length; ++i) {
      if ((coords[i].y < ymin) || (ymin === coords[i].y && coords[i].x < xmin)) {
        xmin = coords[i].x;
        ymin = coords[i].y;
      }
    }
    const first = { x: xmin, y: ymin };

    // right. 
    const path = coords.filter((value) => {
      return Math.abs(first.y - value.y) <= 4 && first.x <= value.x;
    }).sort((a, b) => {
      return a.x - b.x;
    }).slice();

    // down
    let rightCorner = path[path.length - 1];
    path.push(...(coords.slice().filter((value) => {
      return Math.abs(rightCorner.x - value.x) <= 4 && value.y > rightCorner.y;
    }).sort((a, b) => {
      return a.y - b.y;
    })));

    // possible dip
    let bottomRightCorner = path[path.length - 1];
    let sinks = bottomRightCorner;
    coords.forEach((value) => {
      if (value.y > sinks.y + 4) {
        sinks = value;
      } else if (value.y === sinks.y && value.x > sinks.x) {
        sinks = value;
      }
    });
    if (sinks.x !== bottomRightCorner.x && sinks.y !== bottomRightCorner.y) {
      path.push(...coords.filter((value) => {
        return Math.abs(value.y - bottomRightCorner.y) <= 4 && value.x - sinks.x >= 0;
      }).sort((a, b) => {
        return b.x - a.x;
      }));
      rightCorner = path[path.length - 1];
      path.push(...coords.filter((value) => {
        return Math.abs(rightCorner.x - value.x) <= 4 && value.y > rightCorner.y;
      }).sort((a, b) => {
        return a.y - b.y;
      }));
      bottomRightCorner = path[path.length - 1];
    }

    // go left
    path.push(...coords.filter((value) => {
      return Math.abs(value.y - bottomRightCorner.y) <= 4 && bottomRightCorner.x > value.x;
    }).sort((a, b) => {
      return b.x - a.x;
    }));

    // // go up
    let leftCorner = path[path.length - 1];
    path.push(...coords.filter((value) => {
      return Math.abs(leftCorner.x - value.x) <= 4 && value.y < leftCorner.y;
    }).sort((a, b) => {
      return b.y - a.y;
    }));

    // possible risk
    const topLeftCorner = path[path.length - 1];
    let rise = topLeftCorner;
    coords.forEach((value) => {
      if (value.y < rise.y - 3) {
        rise = value;
      } else if (value.y === rise.y && value.x < rise.x) {
        rise = value;
      }
    });

    if (rise.x !== topLeftCorner.x && rise.y !== topLeftCorner.y) {
      path.push(...coords.filter((value) => {
        return Math.abs(value.y - topLeftCorner.y) <= 4 && value.x - first.x <= 4;
      }).sort((a, b) => {
        return a.x - b.x;
      }));
      leftCorner = path[path.length - 1];
      path.push(...coords.filter((value) => {
        return Math.abs(leftCorner.x - value.x) <= 4 && value.y < leftCorner.y;
      }).sort((a, b) => {
        return b.y - a.y;
      }));
    }

    return path;
  }
}
