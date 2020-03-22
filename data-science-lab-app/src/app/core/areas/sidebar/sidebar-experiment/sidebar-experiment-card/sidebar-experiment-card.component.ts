import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Experiment, ExperimentState } from '../../../../../../../shared/models';
import { ExperimentService } from '../../../../../services/experiment-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-sidebar-experiment-card',
  templateUrl: './sidebar-experiment-card.component.html',
  styleUrls: ['./sidebar-experiment-card.component.css']
})
export class SidebarExperimentCardComponent implements OnInit, OnDestroy {

  @Input() experiment: Experiment;

  constructor(private experimentService: ExperimentService) { }

  ngOnInit() {

    this.experimentService.experimentUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.experiment.id) {
          this.experiment = value;
        }
      });
  }

  ngOnDestroy() {
    
  }

}
