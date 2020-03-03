import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Dataset } from '../../../../../../shared/models';
import { DropdownComponent } from '../../../../shared/dropdown/dropdown.component';
import { DeleteDatasetComponent } from '../../../../shared/dataset/delete-dataset/delete-dataset.component';
import { SplitDatasetComponent } from '../../../../shared/dataset/split-dataset/split-dataset.component';

@Component({
  selector: 'app-experiment-dataset-card',
  templateUrl: './experiment-dataset-card.component.html',
})
export class ExperimentDatasetCardComponent implements OnInit {

  @Input() dataset: Dataset;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;

  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteDatasetComponent;
  @ViewChild('splitCmp', { static: false }) splitComponent: SplitDatasetComponent;
  

  constructor() { }

  ngOnInit() {
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

}
