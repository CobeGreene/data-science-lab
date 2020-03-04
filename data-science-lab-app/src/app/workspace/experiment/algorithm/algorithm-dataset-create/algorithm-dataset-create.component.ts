import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { TabService } from '../../../../services/tab-service';
import { TabFactory } from '../../../../factory/tab-factory';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DatasetService } from '../../../../services/dataset-service';
import { Dataset } from '../../../../../../shared/models';

@Component({
  selector: 'app-algorithm-dataset-create',
  templateUrl: './algorithm-dataset-create.component.html',
})
export class AlgorithmDatasetCreateComponent implements OnInit, OnDestroy {

  id: number;
  datasets: Dataset[];

  constructor(
    private routerService: RouterService,
    private tabFactory: TabFactory,
    private tabService: TabService,
    private datasetService: DatasetService
  ) { }

  ngOnInit() {

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().id;
        this.datasets = this.datasetService.all(this.id);
      });

    this.datasetService.datasetsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.datasets = this.datasetService.all(this.id);
      });


    this.id = this.routerService.data().id;
    this.datasets = this.datasetService.all(this.id);

  }

  ngOnDestroy() {

  }

  onExit() {
    this.tabService.removeTab(this.routerService.current());
  }

  onReturn() {
    const tab = this.tabFactory.create(['experiment', this.id, 'algorithm']);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }



}
