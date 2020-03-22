import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dataset } from '../../../../../../shared/models';

@Component({
  selector: 'app-unjoin-dataset-card',
  templateUrl: './unjoin-dataset-card.component.html'
})
export class UnjoinDatasetCardComponent implements OnInit {

  @Input() dataset: Dataset;

  @Output() emitUnjoin = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  
  onAction(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.emitUnjoin.emit();
  }

}
