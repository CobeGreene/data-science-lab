import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { TabService } from '../../../../services/tab-service';
import { TabFactory } from '../../../../factory/tab-factory';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { CoreAreaService } from '../../../../services/core-area-service/core-area.service';

@Component({
  selector: 'app-experiment-navigation',
  templateUrl: './experiment-navigation.component.html',
  styleUrls: ['./experiment-navigation.component.css']
})
export class ExperimentNavigationComponent implements OnInit, OnDestroy {

  id: number;
  state: string;
  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private tabService: TabService, 
    private tabFactory: TabFactory, 
    private coreAreaService: CoreAreaService,
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

    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });

    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

  }

  ngOnDestroy() {

  }

  private getState() {
    const route = this.routerService.current();
    if (route.startsWith(`/experiment/${this.id}/algorithm`)) {
      this.state = 'algorithm';
    } else if (route.startsWith(`/experiment/${this.id}/visual`)) {
      this.state = 'visual';
    } else {
      this.state = 'dataset';
    }
  }

  onDataset() {
    const tab = this.tabFactory.create(['experiment', this.id]);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }

  onAlgorithms() {
    const tab = this.tabFactory.create(['experiment', this.id, 'algorithm']);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }

  onVisuals() {
    const tab = this.tabFactory.create(['experiment', this.id, 'visual']);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }

}
