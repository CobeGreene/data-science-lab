import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { ExperimentService } from '../../../../services/experiment-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { UpdateExperimentComponent } from '../../../../shared/experiment/update-experiment/update-experiment.component';

@Component({
  selector: 'app-experiment-title',
  templateUrl: './experiment-title.component.html',
  styleUrls: ['./experiment-title.component.css']
})
export class ExperimentTitleComponent implements OnInit, OnDestroy {

  id: number;
  title: string;

  @ViewChild('updateCmp', { static: false }) updateComponent: UpdateExperimentComponent;

  constructor(private router: RouterService, private experimentService: ExperimentService) { }

  ngOnInit() {

    this.experimentService.experimentUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.title = value.title;
        }
      });

    this.router.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.router.data().id;
        this.title = this.experimentService.get(this.id).title;
      });
      
      
      this.id = this.router.data().id;
      this.title = this.experimentService.get(this.id).title;
  }

  ngOnDestroy() {

  }

  onUpdate(event: MouseEvent) {
    this.updateComponent.open(event);
  }

}
