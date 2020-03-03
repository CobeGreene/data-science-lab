import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Dataset } from '../../../../../../shared/models';
import { DropdownComponent } from '../../../../shared/dropdown/dropdown.component';
import { DeleteDatasetComponent } from '../../../../shared/dataset/delete-dataset/delete-dataset.component';
import { SplitDatasetComponent } from '../../../../shared/dataset/split-dataset/split-dataset.component';
import { JoinDatasetComponent } from '../../../../shared/dataset/join-dataset/join-dataset.component';
import { DatasetService } from '../../../../services/dataset-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-experiment-dataset-card',
  templateUrl: './experiment-dataset-card.component.html',
})
export class ExperimentDatasetCardComponent implements OnInit, OnDestroy {

  @Input() id: number;

  dataset: Dataset;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;

  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteDatasetComponent;
  @ViewChild('splitCmp', { static: false }) splitComponent: SplitDatasetComponent;
  @ViewChild('joinCmp', { static: false }) joinComponent: JoinDatasetComponent;

  constructor(
    private datasetService: DatasetService
  ) { }

  ngOnInit() {

    this.datasetService.datasetUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.dataset.id) {
          this.dataset = value;
        }
      });

    this.dataset = this.datasetService.get(this.id);
  }

  ngOnDestroy() {

  }

  onOptions(event: MouseEvent) {
    this.optionsComponent.open(event);
  }

  onDelete(event: MouseEvent) {
    this.deleteComponent.open(event);
  }

  onSplit(event: MouseEvent) {
    this.splitComponent.open(event);
  }

  onJoin(event: MouseEvent) {
    this.joinComponent.open(event);
  }

}
