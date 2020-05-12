import { Component, OnInit, ViewChild, OnDestroy, HostBinding } from '@angular/core';
import { PopupComponent } from '../../../../../shared/popup/popup.component';
import { RouterService } from '../../../../../services/router-service';
import { TrackerService } from '../../../../../services/tracker-service';
import { AlgorithmTracker } from '../../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { AlgorithmVisualSessionService } from '../../../../../session-services/algorithm-visual-session-service';
import { CoreAreaService } from '../../../../../services/core-area-service/core-area.service';

@Component({
  selector: 'app-algorithm-trackers',
  templateUrl: './algorithm-trackers.component.html',
  styleUrls: ['./algorithm-trackers.component.css']
})
export class AlgorithmTrackersComponent implements OnInit, OnDestroy {

  @ViewChild('popupCmp', { static: false }) popupComponent: PopupComponent;

  id: number;
  tracker: AlgorithmTracker | undefined;

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(
    private routerService: RouterService,
    private trackerService: TrackerService,
    private coreAreaService: CoreAreaService,
    private sessionService: AlgorithmVisualSessionService
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().algorithmId;
    if (this.trackerService.has(this.id)) {
      this.tracker = this.trackerService.get(this.id);
    }

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.id = this.routerService.data().algorithmId;
        this.tracker = this.trackerService.has(this.id) ? this.trackerService.get(this.id) : undefined;
      });

    this.trackerService.trackersChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        if (this.trackerService.has(this.id)) {
          this.tracker = this.trackerService.get(this.id);
        }
      });

    this.trackerService.trackerUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.algorithmId === this.id) {
          this.tracker = value;
        }
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

  onOpenDesc(event: MouseEvent, index: number) {
    if (this.tracker.variables[index].description === undefined) {
      this.popupComponent.open(event, 'No description given', 'info');
    } else {
      this.popupComponent.open(event, this.tracker.variables[index].description, 'info');
    }
  }

  onVisualize() {
    if (this.tracker !== undefined) {
      this.sessionService.create(this.tracker.algorithmId, {
        currentRoute: this.routerService.current(),
        newTab: true
      }, [0, ...this.tracker.variables.map((_, index) => index + 1)]);
    }
  }

}
