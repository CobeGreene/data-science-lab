import { Component, OnInit } from '@angular/core';
import { RouterService } from '../../../services/router-service';
import { TabService } from '../../../services/tab-service';
import { TabFactory } from '../../../factory/tab-factory';

@Component({
  selector: 'app-experiment-algorithms',
  templateUrl: './experiment-algorithms.component.html',
  styleUrls: ['./experiment-algorithms.component.css']
})
export class ExperimentAlgorithmsComponent implements OnInit {

  constructor(
    private routerService: RouterService,
    private tabFactory: TabFactory,
    private tabService: TabService
  ) { }

  ngOnInit() {
  }

  onCreate(event: MouseEvent) {
    const id = this.routerService.data().id;
    const tab = this.tabFactory.create(['experiment', id, 'algorithm', 'create', 'dataset']);
    this.tabService.openTab(tab);
  }
}
