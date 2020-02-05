import { NgZone, OnInit, OnDestroy, Component, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupViewModel } from '../../../../../../shared/view-models';


@Component({
    selector: 'app-experiment-select-data-group',
    templateUrl: './experiment-select-data-group.component.html',
    styleUrls: []
})
export class ExperimentSelectDataGroupComponent implements OnInit, OnDestroy {

    @Input() dataGroup: DataGroupViewModel;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() { }
    ngOnDestroy() { }

    onSelect() {
        this.router.navigate(['/experiments', 'details', this.dataGroup.experimentId, 'select-algorithm', this.dataGroup.id ]);
    }    

}

