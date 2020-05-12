import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { RouterService } from '../../../services/router-service';
import { TabService } from '../../../services/tab-service';
import { TabFactory } from '../../../factory/tab-factory';
import { AlgorithmService } from '../../../services/algorithm-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Algorithm } from '../../../../../shared/models';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';

@Component({
  selector: 'app-experiment-algorithms',
  templateUrl: './experiment-algorithms.component.html',
  styleUrls: ['./experiment-algorithms.component.css']
})
export class ExperimentAlgorithmsComponent implements OnInit, OnDestroy {

  id: number;
  algorithms: Algorithm[];


  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private algorithmService: AlgorithmService,
    private routerService: RouterService,
    private tabFactory: TabFactory,
    private tabService: TabService,
    private coreAreaService: CoreAreaService,
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().id;
    this.algorithms = this.algorithmService.all(this.id);

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().id;
        this.algorithms = this.algorithmService.all(this.id);
      });

    this.algorithmService.algorithmsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.algorithms = this.algorithmService.all(this.id);
      });


    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });

    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

  }

  ngOnDestroy() {

  }

  onCreate(event: MouseEvent) {
    this.id = this.routerService.data().id;
    const tab = this.tabFactory.create(['experiment', this.id, 'algorithm', 'create', 'dataset']);
    this.tabService.openTab(tab);
  }

  onOpen(event: MouseEvent, index: number) {
    const tab = this.tabFactory.create(['experiment', this.id, 'algorithm', this.algorithms[index].id]);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }
}
