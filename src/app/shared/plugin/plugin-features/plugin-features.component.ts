import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList, HostBinding, OnDestroy } from '@angular/core';
import { Feature } from '../../../../../shared/models';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-plugin-features',
  templateUrl: './plugin-features.component.html',
  styleUrls: ['./plugin-features.component.css']
})
export class PluginFeaturesComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() features: Feature[];
  @Input() selected: number[];

  @Output() emitValues = new EventEmitter<number[]>();

  mouseDown: boolean;
  lastDown: number;

  @ViewChildren('featureCmp', { read: ElementRef }) featureComponents: QueryList<ElementRef<HTMLElement>>;

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(private coreAreaService: CoreAreaService) { }

  ngOnInit() {
    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });
    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

    this.mouseDown = false;
    this.lastDown = -1;
  }

  ngOnDestroy() {

  }

  ngAfterViewInit() {
    this.selected.forEach(index => (this.featureComponents.toArray()[index].nativeElement).classList.add('selected'));
  }

  onSelectAll() {
    this.selected = this.features.map((_, index) => {
      (this.featureComponents.toArray()[index].nativeElement).classList.add('selected');
      return index;
    });
    this.emitValues.emit(this.selected);
  }

  onUnselectAll() {
    this.selected = [];
    this.features.forEach((_, index) => {
      (this.featureComponents.toArray()[index].nativeElement).classList.remove('selected');
    });
    this.emitValues.emit(this.selected);
  }

  private toggleCard(i: number) {
    const index = this.selected.findIndex(value => value === i);
    if (index >= 0) {
      this.selected.splice(index, 1);
    } else {
      this.selected.push(i);
    }
    (this.featureComponents.toArray()[i].nativeElement).classList.toggle('selected');
    this.emitValues.emit(this.selected);
  }

  onMouseDown(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.mouseDown = true;
    if (index >= 0) {
      this.toggleCard(index);
    }
    this.lastDown = index;
  }

  onMouseOver(event: MouseEvent, index: number) {
    if (this.mouseDown) {
      event.stopPropagation();
      event.preventDefault();
      if (this.lastDown !== index) {
        if (index >= 0) {
          this.toggleCard(index);
        }
        this.lastDown = index;
      }
    }
  }

  onMouseUp() {
    this.lastDown = -1;
    this.mouseDown = false;
  }

  onMouseLeave() {
    this.lastDown = -1;
    this.mouseDown = false;
  }

}
