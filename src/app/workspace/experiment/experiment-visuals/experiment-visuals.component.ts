import { Component, OnInit, HostBinding, AfterViewInit, HostListener, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { Visual } from '../../../../../shared/models';
import { RouterService } from '../../../services/router-service';
import { VisualizationService } from '../../../services/visualization-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-experiment-visuals',
  templateUrl: './experiment-visuals.component.html',
  styleUrls: ['./experiment-visuals.component.css']
})
export class ExperimentVisualsComponent implements OnInit, OnDestroy, AfterViewInit {

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
    private ref: ChangeDetectorRef,
    private zone: NgZone,
    private visualizeService: VisualizationService) {

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
    const right = value.left * 50 + value.width * 50;
    const bottom = value.top * 50 + value.height * 50;
    if (right > width) {
      width = right;
    }
    if (bottom > height) {
      height = bottom;
    }
  });

  width += 50 * 5;
  height += 50 * 5;

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

      this.actionOnVisual.left * 50 + this.actionOnVisual.width * 50;
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
