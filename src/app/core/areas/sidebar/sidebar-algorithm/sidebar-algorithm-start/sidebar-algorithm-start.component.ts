import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../../../../services/algorithm-service';

@Component({
  selector: 'app-sidebar-algorithm-start',
  templateUrl: './sidebar-algorithm-start.component.html',
  styleUrls: ['./sidebar-algorithm-start.component.css']
})
export class SidebarAlgorithmStartComponent implements OnInit {

  constructor(private algorithmService: AlgorithmService) { }

  ngOnInit() {
  }

  onClick(_: MouseEvent) {
    const algorithms = this.algorithmService.all();
    algorithms.forEach((value) => {
      if (!value.isTraining && !value.isFinish) {
        this.algorithmService.start(value.id);
      }
    });
  }

}
