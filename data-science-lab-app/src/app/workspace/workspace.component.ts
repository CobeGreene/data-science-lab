import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Area } from '../models';
import { CoreAreaService } from '../services/core-area-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html'
})
export class WorkspaceComponent implements OnInit, OnDestroy {

  area: Area;

  constructor(private coreAreaService: CoreAreaService) {

  }


  ngOnInit() {
    this.coreAreaService.sizeChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.area = this.coreAreaService.getWorkspace();
      });

    this.area = this.coreAreaService.getWorkspace();
  }

  ngOnDestroy() {

  }

}
