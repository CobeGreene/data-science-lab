import { Component, OnInit } from '@angular/core';
import { FetchSessionService } from '../../../session-services/fetch-session-service';
import { RouterService } from '../../../services/router-service';

@Component({
  selector: 'app-experiment-datasets',
  templateUrl: './experiment-datasets.component.html',
  styleUrls: ['./experiment-datasets.component.css']
})
export class ExperimentDatasetsComponent implements OnInit {

  id: number;

  constructor(
    private routerService: RouterService,
    private fetchSessionService: FetchSessionService 
  ) {

  }

  ngOnInit() {
    this.id = this.routerService.data().id;

  }

  onCreate(_: MouseEvent) {
    this.fetchSessionService.create(this.id, {
      currentRoute: this.routerService.current(),
      newTab: true,
    });
  }

}
