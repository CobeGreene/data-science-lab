import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-experiment',
  templateUrl: './experiment.component.html'
})
export class ExperimentComponent implements OnInit {

  @ViewChild('headerCmp', { static: false, read: ElementRef }) headerComponent: ElementRef;

  isExpanded: boolean;
  
  constructor() { }

  ngOnInit() {
  }

  onExpanded(event) {
    this.isExpanded = event;
  }

}
