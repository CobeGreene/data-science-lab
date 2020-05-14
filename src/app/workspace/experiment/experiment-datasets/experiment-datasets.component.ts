import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { FetchSessionService } from '../../../session-services/fetch-session-service';
import { RouterService } from '../../../services/router-service';
import { DatasetService } from '../../../services/dataset-service';
import { TabService } from '../../../services/tab-service';
import { TabFactory } from '../../../factory/tab-factory';
import { Dataset } from '../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';


@Component({
  selector: 'app-experiment-datasets',
  templateUrl: './experiment-datasets.component.html',
  styleUrls: ['./experiment-datasets.component.css']
})
export class ExperimentDatasetsComponent implements OnInit, OnDestroy {

  datasets: Dataset[];
  id: number;

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private routerService: RouterService,
    private fetchSessionService: FetchSessionService,
    private datasetService: DatasetService,
    private tabFactory: TabFactory,
    private tabService: TabService,
    private coreAreaService: CoreAreaService,
  ) {

  }

  ngOnInit() {
    this.id = this.routerService.data().id;

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.id = this.routerService.data().id;
        this.datasets = this.datasetService.all(this.id);
      });

    this.datasetService.datasetsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        this.datasets = this.datasetService.all(this.id);
      });

    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });

    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();
    this.datasets = this.datasetService.all(this.id);

  }

  ngOnDestroy() {
  }

  onCreate(_: MouseEvent) {
    this.fetchSessionService.create(this.id, {
      currentRoute: this.routerService.current(),
      newTab: true,
    });
  }

  onOpen(_: MouseEvent, index: number) {
    const tab = this.tabFactory.create(['experiment', this.id, 'dataset', this.datasets[index].id]);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }

}
