import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { DataGroupsService, AlgorithmTestingSessionService } from '../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupViewModel } from '../../../../../shared/view-models';



@Component({
    selector: 'app-experiment-algorithm-testing-data-group',
    templateUrl: './experiment-algorithm-testing-data-group.component.html',
    styleUrls: []
})
export class ExperimentAlgorithmTestingDataGroupComponent implements OnInit, OnDestroy {

    private experimentId: number;
    private id: number;
    private dataGroups: DataGroupViewModel[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private algorithmTestingService: AlgorithmTestingSessionService,
        private dataGroupService: DataGroupsService) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
                this.dataGroups = this.dataGroupService.all(this.experimentId);
            });

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.algorithmId;
            });

        this.algorithmTestingService.newTestingSession
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value.id === this.id) {
                    this.router.navigate(['experiments', 'details', this.experimentId, 'algorithm-testing-input', this.id]);
                }
            });

    }


    ngOnDestroy() {

    }

    onSelect(index: number) {
        this.algorithmTestingService.requestTest(this.id, this.dataGroups[index].id);
    }
}
