import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Visual } from '../../../../../../shared/models';
import { RouterService } from '../../../../services/router-service';
import { VisualizationService } from '../../../../services/visualization-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { CoreAreaService } from '../../../../services/core-area-service/core-area.service';

@Component({
  selector: 'app-experiment-visuals-grid',
  templateUrl: './experiment-visuals-grid.component.html',
  styleUrls: ['./experiment-visuals-grid.component.css']
})
export class ExperimentVisualsGridComponent implements OnInit, OnDestroy {

  id: number;
  visuals: Visual[];

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private routerService: RouterService,
    private visualService: VisualizationService,
    private coreAreaService: CoreAreaService,
  ) { }


  ngOnInit() {
    this.id = this.routerService.data().id;

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


    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });

    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

    this.visuals = this.visualService.all(this.id);
  }

  ngOnDestroy() {

  }

  onShow(_: MouseEvent, i: number) {
    this.visualService.show(this.visuals[i].id);
  }

}
