import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Area } from '../../../models/area';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { WorkspaceService } from '../../../services/workspace-service';
import { ShortcutService } from '../../../services/shortcut-service';

@Component({
  selector: 'app-experiment-header',
  templateUrl: './experiment-header.component.html',
  styleUrls: ['./experiment-header.component.css']
})
export class ExperimentHeaderComponent implements OnInit, OnDestroy {

  area: Area;
  isExpanded: boolean;

  @Output() emitExpanded = new EventEmitter<boolean>();

  constructor(
    private coreAreaService: CoreAreaService,
    private workspaceService: WorkspaceService,
    private shortcutService: ShortcutService,  
  ) { }

  ngOnInit() {
    
    this.coreAreaService.sizeChanged
    .pipe(untilComponentDestroyed(this))
    .subscribe(() => {
      this.area = this.coreAreaService.getWorkspace();
    });

    this.area = this.coreAreaService.getWorkspace();
    this.isExpanded = this.workspaceService.get<boolean>('experiment-header', true);

    this.emitExpanded.emit(this.isExpanded);

    this.shortcutService.subscribe('ctrl + keyk', this.onToggleExpanded);
  }
  
  ngOnDestroy() {
    this.workspaceService.set<boolean>('experiment-header', this.isExpanded);
    this.shortcutService.unsubscribe('ctrl + keyk', this.onToggleExpanded);
  }

  onToggleExpanded = (): void => {
    this.isExpanded = !this.isExpanded;
    this.emitExpanded.emit(this.isExpanded);
  }

}
