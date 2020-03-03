import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { TabService } from '../../../../services/tab-service';
import { TabFactory } from '../../../../factory/tab-factory';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-experiment-navigation',
  templateUrl: './experiment-navigation.component.html',
  styleUrls: ['./experiment-navigation.component.css']
})
export class ExperimentNavigationComponent implements OnInit, OnDestroy {

  id: number;
  state: string;

  constructor(
    private tabService: TabService, 
    private tabFactory: TabFactory, 
    private routerService: RouterService) { }

  ngOnInit() {
    this.id = this.routerService.data().id;

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().id;
        this.getState();
      });

    this.getState();

  }

  ngOnDestroy() {

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
