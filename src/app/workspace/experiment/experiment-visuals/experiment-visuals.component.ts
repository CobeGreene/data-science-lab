import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterService } from '../../../services/router-service';
import { WorkspaceService } from '../../../services/workspace-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ExperimentVisualsWorkspaceComponent } from './experiment-visuals-workspace/experiment-visuals-workspace.component';


@Component({
  selector: 'app-experiment-visuals',
  templateUrl: './experiment-visuals.component.html',
  styleUrls: ['./experiment-visuals.component.css']
})
export class ExperimentVisualsComponent implements OnInit, OnDestroy {

  view: string;

  @ViewChild('workspaceCmp', { static: false}) workspaceComponent: ExperimentVisualsWorkspaceComponent;

  constructor(
    private routerService: RouterService,
    private workspaceService: WorkspaceService) {

  }

  ngOnInit() {
    this.view = this.workspaceService.get<string>(this.routerService.current(),
      'grid');

  }

  ngOnDestroy() {
  }
  
  onView(value: string) {
    this.view = value;
    this.workspaceService.set(this.routerService.current(), this.view);
  }

  onArrange() {
    this.workspaceComponent.arrange();
  }

}
