import { NgZone, OnInit, OnDestroy, Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupsService } from '../../../services/data-groups-services/data-groups.service';
import { DataGroupViewModel } from '../../../../../shared/view-models';


@Component({
    selector: 'app-experiment-select-data-algorithm',
    templateUrl: './experiment-select-data-algorithm.component.html',
    styleUrls: []
})
export class ExperimentSelectDataAlgorithmComponent implements OnInit, OnDestroy {

    experimentId: number;
    dataGroups: DataGroupViewModel[];

    constructor(private route: ActivatedRoute, private router: Router,
                private service: DataGroupsService) {

    }


    ngOnInit() {
        this.dataGroups = [];
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
                this.dataGroups = this.service.all(this.experimentId);
            });

        this.service.newDataGroup
            .pipe(untilComponentDestroyed(this))
            .subscribe((_) => {
                this.dataGroups = this.service.all(this.experimentId);
            });

        this.service.deletedDataGroup
            .pipe(untilComponentDestroyed(this))
            .subscribe((_) => {
                this.dataGroups = this.service.all(this.experimentId);
            });

    }

    ngOnDestroy() {

    }

    onBack() {
        this.router.navigate(['/experiments', 'details', this.experimentId, 'algorithm-workspace']);
    }

}

