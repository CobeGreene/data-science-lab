import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Dataset } from '../../../../../../../shared/models';
import { RouterService } from '../../../../../services/router-service';
import { DatasetService } from '../../../../../services/dataset-service';
import { TransformSessionService } from '../../../../../session-services/transform-session-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DatasetVisualSessionService } from '../../../../../session-services/dataset-visual-session-service';
import { CoreAreaService } from '../../../../../services/core-area-service/core-area.service';

@Component({
  selector: 'app-dataset-features',
  templateUrl: './dataset-features.component.html',
  styleUrls: ['./dataset-features.component.css']
})
export class DatasetFeaturesComponent implements OnInit, OnDestroy {

  id: number;
  dataset: Dataset;

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private routerService: RouterService,
    private datasetService: DatasetService,
    private transformService: TransformSessionService,
    private coreAreaService: CoreAreaService,
    private visualizeService: DatasetVisualSessionService
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().datasetId;

    this.datasetService.datasetUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.dataset = value;
        }
      });

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().datasetId;
        this.dataset = this.datasetService.get(this.id);
      });


    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });
    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

    this.dataset = this.datasetService.get(this.id);

  }

  onTransform() {
    this.transformService.create(this.id, {
      currentRoute: this.routerService.current(),
      newTab: true,
    }, this.dataset.features.map((_, index) => index));
  }

  onVisualize() {
    this.visualizeService.create(this.id, {
      currentRoute: this.routerService.current(),
      newTab: true,
    }, this.dataset.features.map((_, index) => index));
  }

  ngOnDestroy() {

  }


}
