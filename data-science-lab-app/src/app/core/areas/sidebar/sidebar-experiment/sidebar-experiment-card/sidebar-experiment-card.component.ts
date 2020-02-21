import { Component, OnInit, Input } from '@angular/core';
import { Experiment } from '../../../../../../../shared/models';

@Component({
  selector: 'app-sidebar-experiment-card',
  templateUrl: './sidebar-experiment-card.component.html',
  styleUrls: ['./sidebar-experiment-card.component.css']
})
export class SidebarExperimentCardComponent implements OnInit {

  @Input() experiment: Experiment;

  constructor() { }

  ngOnInit() {
  }

}
