import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { TabService } from '../../../../services/tab-service';
import { TabFactory } from '../../../../factory/tab-factory';

@Component({
  selector: 'app-experiment-navigation',
  templateUrl: './experiment-navigation.component.html',
  styleUrls: ['./experiment-navigation.component.css']
})
export class ExperimentNavigationComponent implements OnInit {

  id: number;
  state: string;

  constructor(
    private tabService: TabService, 
    private tabFactory: TabFactory, 
    private routerService: RouterService) { }

  ngOnInit() {
    this.id = this.routerService.data().id;
    this.getState();
  }

  private getState() {
    const route = this.routerService.current();
    if (route.startsWith(`/experiment/${this.id}/algorithms`)) {
      this.state = 'algorithm';
    } else if (route.startsWith(`/experiment/${this.id}/visuals`)) {
      this.state = 'visual';
    } else {
      this.state = 'dataset';
    }
  }

}
