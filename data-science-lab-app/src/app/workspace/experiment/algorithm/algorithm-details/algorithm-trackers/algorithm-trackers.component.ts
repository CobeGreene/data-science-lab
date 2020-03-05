import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PopupComponent } from '../../../../../shared/popup/popup.component';
import { RouterService } from '../../../../../services/router-service';
import { TrackerService } from '../../../../../services/tracker-service';
import { AlgorithmTracker } from '../../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-algorithm-trackers',
  templateUrl: './algorithm-trackers.component.html',
  styleUrls: ['./algorithm-trackers.component.css']
})
export class AlgorithmTrackersComponent implements OnInit, OnDestroy {

  @ViewChild('popupCmp', { static: false }) popupComponent: PopupComponent;

  id: number;
  tracker: AlgorithmTracker | undefined;

  constructor(
    private routerService: RouterService,
    private trackerService: TrackerService
  ) { }

  ngOnInit() {
    this.id = this.routerService.data().algorithmId;

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
    
  }

}
