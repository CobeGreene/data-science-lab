import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlgorithmService, AlgorithmTrackerService, VisualizationAlgorithmSessionService } from '../../../services';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AlgorithmViewModel, AlgorithmTrackerViewModel, AlgorithmTrackerVariableViewModel } from '../../../../../shared/view-models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';




@Component({
    selector: 'app-experiment-algorithm-details',
    templateUrl: './experiment-algorithm-details.component.html',
    styleUrls: []
})
export class ExperimentAlgorithmDetailsComponent implements OnInit, OnDestroy {

    id: number;
    algorithm: AlgorithmViewModel;

    tracker: AlgorithmTrackerViewModel;
    hasTracker = false;

    constructor(private service: AlgorithmService, private route: ActivatedRoute,
                private trackerService: AlgorithmTrackerService,
                private router: Router,
                private visualizeService: VisualizationAlgorithmSessionService) {

    }

    ngOnInit() {

        if (this.trackerService.has(this.id)) {
            this.tracker = this.trackerService.get(this.id);
            this.hasTracker = true;
        }

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.algorithmId;
                this.algorithm = this.service.get(this.id);
            });

        this.service.updatedAlgorithm
            .pipe(untilComponentDestroyed(this))
            .subscribe((algorithm) => {
                if (algorithm.id === this.id) {
                    this.algorithm = algorithm;
                }
            });

        this.trackerService.newTracker
            .pipe(untilComponentDestroyed(this))
            .subscribe((tracker) => {
                if (tracker.algorithmId === this.id) {
                    this.tracker = tracker;
                    this.hasTracker = true;
                }
            });

        this.trackerService.updateTracker
            .pipe(untilComponentDestroyed(this))
            .subscribe((tracker) => {
                if (tracker.algorithmId === this.id) {
                    this.tracker = tracker;
                    this.hasTracker = true;
                }
            });
    }

    ngOnDestroy() {

    }

    last5ValuesOfVariable(variable: AlgorithmTrackerVariableViewModel): any[] {
        const values = variable.values;
        if (values.length <= 5) {
            return values;
        } else {
            return values.slice(values.length - 5, values.length);
        }
    }

    onStart() {
        this.service.start(this.id);
    }

    onStop() {
        this.service.stop(this.id);
    }

    onVisualize() {
        if (this.visualizeService.hasSession(this.id)) {
            this.router.navigate(['/experiments', 'details', this.algorithm.experimentId, 'setup-algorithm-visualization', this.id]);
        } else {
            this.router.navigate(['/experiments', 'details', this.algorithm.experimentId, 'select-algorithm-visualization', this.id]);
        }
    }
}

