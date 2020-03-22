import { Component, OnInit, OnDestroy } from '@angular/core';
import { FetchSessionService } from '../../../session-services/fetch-session-service';
import { RouterService } from '../../../services/router-service';
import { DatasetService } from '../../../services/dataset-service';
import { TabService } from '../../../services/tab-service';
import { TabFactory } from '../../../factory/tab-factory';
import { Dataset } from '../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-experiment-datasets',
  templateUrl: './experiment-datasets.component.html',
  styleUrls: ['./experiment-datasets.component.css']
})
export class ExperimentDatasetsComponent implements OnInit, OnDestroy {

  datasets: Dataset[];
  id: number;

  constructor(
    private routerService: RouterService,
    private fetchSessionService: FetchSessionService,
    private datasetService: DatasetService,
    private tabFactory: TabFactory,
    private tabService: TabService
  ) {

  }

  ngOnInit() {
    this.id = this.routerService.data().id;

    this.datasetService.datasetsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.datasets = this.datasetService.all(this.id);
      });

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
    this.tabService.replaceTab(this.routerService.current(),tab);
  }

}
