import { Component, OnInit, Input } from '@angular/core';
import { Experiment } from '../../../../../../shared/models';

@Component({
  selector: 'app-load-experiment-card',
  templateUrl: './load-experiment-card.component.html',
  styleUrls: ['./load-experiment-card.component.css']
})
export class LoadExperimentCardComponent implements OnInit {

  @Input() experiment: Experiment;

  constructor() { }

  ngOnInit() {
  }

}
