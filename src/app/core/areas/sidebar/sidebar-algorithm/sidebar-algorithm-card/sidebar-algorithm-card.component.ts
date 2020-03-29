import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Algorithm } from '../../../../../../../shared/models';

@Component({
  selector: 'app-sidebar-algorithm-card',
  templateUrl: './sidebar-algorithm-card.component.html',
  styleUrls: ['./sidebar-algorithm-card.component.css']
})
export class SidebarAlgorithmCardComponent implements OnInit, OnDestroy {

  @Input() algorithm: Algorithm;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {

  }

}
