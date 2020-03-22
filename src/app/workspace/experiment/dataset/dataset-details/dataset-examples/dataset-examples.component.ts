import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Dataset } from '../../../../../../../shared/models';
import { RouterService } from '../../../../../services/router-service';
import { DatasetService } from '../../../../../services/dataset-service';
import { SplitDatasetComponent } from '../../../../../shared/dataset/split-dataset/split-dataset.component';
import { JoinDatasetComponent } from '../../../../../shared/dataset/join-dataset/join-dataset.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-dataset-examples',
  templateUrl: './dataset-examples.component.html',
  styleUrls: ['./dataset-examples.component.css']
})
export class DatasetExamplesComponent implements OnInit, OnDestroy {

  id: number;
  dataset: Dataset;

  @ViewChild('splitCmp', { static: false }) splitComponent: SplitDatasetComponent;
  @ViewChild('joinCmp', { static: false }) joinComponent: JoinDatasetComponent;

  constructor(private routerService: RouterService, private datasetService: DatasetService) {

  }

  ngOnInit() {
    this.id = this.routerService.data().datasetId;

    this.datasetService.datasetUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.dataset = value;
        }
      });

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().datasetId;
        this.dataset = this.datasetService.get(this.id);
      });

    this.dataset = this.datasetService.get(this.id);

  }

  ngOnDestroy() {

  }

  onSplit(event: MouseEvent) {
    this.splitComponent.open(event);
  }

  onJoin(event: MouseEvent) {
    this.joinComponent.open(event);
  }

  onShowMore() {
    this.datasetService.show(this.id);
  }



}
