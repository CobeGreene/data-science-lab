import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataGroupsService } from '../../../../services/data-groups-services/data-groups.service';
import { ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupViewModel } from '../../../../../../shared/view-models';



@Component({
    selector: 'app-experiment-data-group-list',
    templateUrl: './experiment-data-group-list.component.html',
    styleUrls: []
})
export class ExperimentDataGroupListComponent implements OnInit, OnDestroy {

    private experimentId: number;
    private dataGroups: DataGroupViewModel[];

    constructor(private dataGroupsService: DataGroupsService,
                private route: ActivatedRoute) {

        this.dataGroups = [];
    }

    ngOnInit() {


        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
                this.dataGroups = this.dataGroupsService.all(this.experimentId);
            });

        this.dataGroupsService.newDataGroup
            .pipe(untilComponentDestroyed(this))
            .subscribe((dataGroup) => {
                if (dataGroup.experimentId === this.experimentId) {
                    this.dataGroups.push(dataGroup);
                }
            });

        this.dataGroupsService.dataGroupsChanged
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                this.dataGroups = this.dataGroupsService.all(this.experimentId);
            });

        this.dataGroupsService.deletedDataGroup
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const findIndex = this.dataGroups.findIndex((value) => {
                    return value.id === id;
                });
                if (findIndex >= 0) {
                    this.dataGroups.splice(findIndex, 1);
                }
            });

    }

    ngOnDestroy() {

    }
}

