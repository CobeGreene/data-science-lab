import { Component, OnInit } from '@angular/core';
import { AlgorithmService } from '../../../../../services/algorithm-service';

@Component({
  selector: 'app-sidebar-algorithm-stop',
  templateUrl: './sidebar-algorithm-stop.component.html',
  styleUrls: ['./sidebar-algorithm-stop.component.css']
})
export class SidebarAlgorithmStopComponent implements OnInit {

  constructor(private algorithmService: AlgorithmService) { }

  ngOnInit() {
  }

  onClick(_: MouseEvent) {
    const algorithms = this.algorithmService.all();
    algorithms.forEach((value) => {
      if (value.isTraining) {
        this.algorithmService.stop(value.id);
      }
    });
  }


}
