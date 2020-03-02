import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Dataset } from '../../../../../../shared/models';
import { DropdownComponent } from '../../../../shared/dropdown/dropdown.component';

@Component({
  selector: 'app-experiment-dataset-card',
  templateUrl: './experiment-dataset-card.component.html',
})
export class ExperimentDatasetCardComponent implements OnInit {

  @Input() dataset: Dataset;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;


  constructor() { }

  ngOnInit() {
  }

  onOptions(event: MouseEvent) {
    this.optionsComponent.open(event);
  }

}
