import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dataset } from '../../../../../../shared/models';

@Component({
  selector: 'app-select-dataset-card',
  templateUrl: './select-dataset-card.component.html',
  styleUrls: ['./select-dataset-card.component.css']
})
export class SelectDatasetCardComponent implements OnInit {

  @Input() dataset: Dataset;

  @Output() emitSelect = new EventEmitter<Dataset>();
  
  constructor() { }

  ngOnInit() {
  }

  onSelect() {
    this.emitSelect.emit(this.dataset);
  }

}
