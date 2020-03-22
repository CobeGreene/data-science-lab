import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Dataset } from '../../../../../../shared/models';

@Component({
  selector: 'app-join-dataset-card',
  templateUrl: './join-dataset-card.component.html'
})
export class JoinDatasetCardComponent implements OnInit {

  @Input() dataset: Dataset;

  @Output() emitJoin = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  
  onAction(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.emitJoin.emit();

  }

}
