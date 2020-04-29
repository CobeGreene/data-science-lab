import { Component, OnInit, Input } from '@angular/core';
import { Experiment } from '../../../../../../shared/models';

@Component({
  selector: 'app-open-experiment-card',
  templateUrl: './open-experiment-card.component.html',
  styleUrls: ['./open-experiment-card.component.css']
})
export class OpenExperimentCardComponent implements OnInit {

  @Input() experiment: Experiment;

  constructor() { }

  ngOnInit() {
  }

}
