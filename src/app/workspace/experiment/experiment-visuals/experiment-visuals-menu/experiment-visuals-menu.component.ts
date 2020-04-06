import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { VisualizationService } from '../../../../services/visualization-service';
import { RouterService } from '../../../../services/router-service';
import { DropdownComponent } from '../../../../shared/dropdown/dropdown.component';
import { Visual } from '../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { CoreAreaService } from '../../../../services/core-area-service/core-area.service';
import { Area } from '../../../../models/area';

@Component({
  selector: 'app-experiment-visuals-menu',
  templateUrl: './experiment-visuals-menu.component.html',
  styleUrls: ['./experiment-visuals-menu.component.css']
})
export class ExperimentVisualsMenuComponent implements OnInit, OnDestroy {

  @Input() view: string;

  id: number;
  area: Area;
  visuals: Visual[];

  @ViewChild('visualsCmp', { static: false }) visualsComponent: ElementRef<HTMLDivElement>;
  @ViewChild('dropdownCmp', { static: false }) dropdownComponent: DropdownComponent;

  @Output() emitView: EventEmitter<string> = new EventEmitter<string>();
  @Output() emitArrange: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private routerService: RouterService,
    private coreAreaService: CoreAreaService,
    private visualService: VisualizationService) {

  }

  ngOnInit() {
    this.coreAreaService.sizeChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.area = this.coreAreaService.getWorkspace();
      });
      
    this.id = this.routerService.data().id;
    this.area = this.coreAreaService.getWorkspace();

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.id = this.routerService.data().id;
        this.visuals = this.visualService.all(this.id);
      });

    this.visualService.visualsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.visuals = this.visualService.all(this.id);
      });

  }

  ngOnDestroy() {

  }

  onShow(id: number) {
    this.visualService.show(id);
    this.dropdownComponent.close();
  }

  onOpenDropdown(event: MouseEvent) {
    this.dropdownComponent.open(event, this.visualsComponent);
  }

  onChange(value: string) {
    this.emitView.emit(value);
  }

  onArrange() {
    this.emitArrange.emit();
  }

}
