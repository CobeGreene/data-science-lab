import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateExperimentComponent } from '../../../../../shared/experiment/create-experiment/create-experiment.component';

@Component({
  selector: 'app-sidebar-experiment-create',
  templateUrl: './sidebar-experiment-create.component.html',
  styleUrls: ['./sidebar-experiment-create.component.css']
})
export class SidebarExperimentCreateComponent implements OnInit {

  @ViewChild('createCmp', { static: false }) createComponent: CreateExperimentComponent;

  constructor() { }

  ngOnInit() {
  }

  onCreate(event: MouseEvent) {
    this.createComponent.open(event);
  }

}
