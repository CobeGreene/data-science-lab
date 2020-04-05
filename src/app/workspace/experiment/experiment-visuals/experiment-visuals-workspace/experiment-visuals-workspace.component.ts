import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, NgZone, AfterViewInit, OnDestroy } from '@angular/core';
import { Visual } from '../../../../../../shared/models';
import { RouterService } from '../../../../services/router-service';
import { VisualizationService } from '../../../../services/visualization-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-experiment-visuals-workspace',
  templateUrl: './experiment-visuals-workspace.component.html',
  styleUrls: ['./experiment-visuals-workspace.component.css']
})
export class ExperimentVisualsWorkspaceComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly length: number = 50;

  @ViewChild('containerCmp', { static: false }) containerComponent: ElementRef<HTMLDivElement>;

  id: number;
  visuals: Visual[];

  mouseDown: boolean;
  actionOnVisual: Visual | undefined;
  referenceEvent: MouseEvent | undefined;
  referenceTop: number;
  referenceLeft: number;
  referenceWidth: number;
  referenceHeight: number;
  isMove: boolean;
  width: number;
  height: number;

  get isExpand(): boolean {
    return !this.isMove;
  }

  set moving(moving: boolean) {
    this.isMove = moving;
  }

  set expanding(expanding: boolean) {
    this.isMove = !expanding;
  }

  constructor(
    private routerService: RouterService,
    private visualizeService: VisualizationService) {

  }

  arrange() {
    const visuals = this.visuals.sort((lhs, rhs) => {
      return (rhs.width * rhs.height) - (lhs.width * lhs.height);
    });
    const width = Math.sqrt(visuals.map(v => v.width * v.width).reduce((p, c) => p + c, 0));
    let left = 0;
    let top = 0;

    if (visuals.length >= 1) {
      visuals[0].top = 0;
      visuals[0].left = 0;
    }

    for (let i = 1; i < visuals.length; ++i) {
      let overlap = this.visualOverlaps({ top, left, width: visuals[i].width, height: visuals[i].height }, visuals.slice(0, i));
      while (overlap !== undefined) {
        left = overlap.left + overlap.width;
        if (left > width) {
          left = 0;
          top++;
        }
        overlap = this.visualOverlaps({ top, left, width: visuals[i].width, height: visuals[i].height }, visuals.slice(0, i));
      }
      visuals[i].left = left;
      visuals[i].top = top;
    }

    visuals.forEach((value) => {
      this.visualizeService.reposition(value.id, value.top, value.left);
    })
    this.calculateDimensions();
  }

  visualOverlaps(dim: { top: number, left: number, width: number, height: number }, visuals: Visual[]): Visual | undefined {
    for (let visual of visuals) {
      if ((dim.left < visual.left + visual.width) &&
      (dim.left + dim.width > visual.left) &&
      (dim.top < visual.top + visual.height) &&
      (dim.top + dim.height > visual.top)) {
        return visual;
      }
    }
    return undefined;
  }




  ngOnInit() {
    this.mouseDown = false;
    this.actionOnVisual = undefined;
    this.isMove = false;
    this.referenceEvent = undefined;

    this.id = this.routerService.data().id;
    this.visuals = this.visualizeService.all(this.id);

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().id;
        this.visuals = this.visualizeService.all(this.id);
        this.calculateDimensions();
      });

    this.visualizeService.visualsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.visuals = this.visualizeService.all(this.id);
        this.calculateDimensions();
      });

    this.calculateDimensions();

  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
  }

  calculateDimensions() {
    let width = 0;
    let height = 0;
    this.visuals.forEach((value) => {
      const right = value.left * this.length + value.width * this.length;
      const bottom = value.top * this.length + value.height * this.length;
      if (right > width) {
        width = right;
      }
      if (bottom > height) {
        height = bottom;
      }
    });

    width += this.length * 5;
    height += this.length * 5;

    this.width = width;
    this.height = height;
  }

  onMouseMove(event: MouseEvent) {
    if (this.mouseDown && this.actionOnVisual !== undefined) {
      const changeInX = Math.floor((event.x - this.referenceEvent.x) / this.length);
      const changeInY = Math.floor((event.y - this.referenceEvent.y) / this.length);

      if (this.isMove) {
        if (changeInX > 0) {
          this.actionOnVisual.left = this.referenceLeft + changeInX;
        } else if (this.referenceLeft + changeInX < 0) {
          this.actionOnVisual.left = 0;
        } else {
          this.actionOnVisual.left = this.referenceLeft + changeInX;
        }

        if (changeInY > 0) {
          this.actionOnVisual.top = this.referenceTop + changeInY;
        } else if (this.referenceTop + changeInY < 0) {
          this.actionOnVisual.top = 0;
        } else {
          this.actionOnVisual.top = this.referenceTop + changeInY;
        }

        this.actionOnVisual.left * this.length + this.actionOnVisual.width * this.length;
      } else {
        if (changeInX > 0) {
          this.actionOnVisual.width = this.referenceWidth + changeInX;
        } else if (this.referenceWidth + changeInX < 3) {
          this.actionOnVisual.width = 3;
        } else {
          this.actionOnVisual.width = this.referenceWidth + changeInX;
        }

        if (changeInY > 0) {
          this.actionOnVisual.height = this.referenceHeight + changeInY;
        } else if (this.referenceHeight + changeInY < 3) {
          this.actionOnVisual.height = 3;
        } else {
          this.actionOnVisual.height = this.referenceHeight + changeInY;
        }
      }

      this.calculateDimensions();
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.actionOnVisual !== undefined) {
      this.mouseDown = false;
      this.actionOnVisual.zindex = 1;
      if (this.isMove) {
        this.visualizeService.reposition(this.actionOnVisual.id, this.actionOnVisual.top, this.actionOnVisual.left);
      } else {
        this.visualizeService.resize(this.actionOnVisual.id, this.actionOnVisual.width, this.actionOnVisual.height);
      }
      this.actionOnVisual = undefined;
      this.isMove = false;
      this.referenceEvent = undefined;
    }
  }

  onMove(action: { event: MouseEvent, visual: Visual }) {
    this.mouseDown = true;
    this.moving = true;
    this.referenceEvent = action.event;
    this.actionOnVisual = action.visual;
    this.referenceTop = action.visual.top;
    this.referenceLeft = action.visual.left;
    this.actionOnVisual.zindex = 5;
  }

  onExpand(action: { event: MouseEvent, visual: Visual }) {
    this.mouseDown = true;
    this.expanding = true;
    this.referenceEvent = action.event;
    this.actionOnVisual = action.visual;
    this.referenceWidth = action.visual.width;
    this.referenceHeight = action.visual.height;
    this.actionOnVisual.zindex = 5;
  }

}
