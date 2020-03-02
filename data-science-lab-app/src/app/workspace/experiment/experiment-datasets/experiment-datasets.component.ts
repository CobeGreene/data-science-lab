import { Component, OnInit } from '@angular/core';
import { FetchSessionService } from '../../../session-services/fetch-session-service';
import { RouterService } from '../../../services/router-service';
import { DatasetService } from '../../../services/dataset-service';
import { Dataset } from '../../../../../shared/models';

@Component({
  selector: 'app-experiment-datasets',
  templateUrl: './experiment-datasets.component.html',
  styleUrls: ['./experiment-datasets.component.css']
})
export class ExperimentDatasetsComponent implements OnInit {

  datasets: Dataset[];
  id: number;

  constructor(
    private routerService: RouterService,
    private fetchSessionService: FetchSessionService,
    private datasetService: DatasetService, 
  ) {

  }

  ngOnInit() {
    this.id = this.routerService.data().id;

    this.datasetService.datasetsChanged
      .subscribe((value) => {
        this.datasets = this.datasetService.all(this.id);
      });

    this.datasets = this.datasetService.all(this.id);
  }

  onCreate(_: MouseEvent) {
    this.fetchSessionService.create(this.id, {
      currentRoute: this.routerService.current(),
      newTab: true,
    });
  }

}
