import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Dataset } from '../../../../../shared/models';

@Component({
  selector: 'app-select-dataset',
  templateUrl: './select-dataset.component.html',
  styleUrls: ['./select-dataset.component.css']
})
export class SelectDatasetComponent implements OnInit {

  @Output() emitDataset = new EventEmitter<Dataset>();
  @Input() datasets: Dataset[];

  constructor() { }

  ngOnInit() {
  }

  onSelect(event: Dataset) {
    this.emitDataset.next(event);
  }

}
