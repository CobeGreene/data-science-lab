import { OnInit, OnDestroy, Component } from '@angular/core';
import { SelectTransformPlugin } from '../../../../../shared/models';
import { TransformSessionService, TransformPluginsService, DataGroupsService } from '../../../services';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DataGroupViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-input-transform',
    templateUrl: './experiment-input-transform.component.html',
    styleUrls: []
})
export class ExperimentInputTransformComponent implements OnInit, OnDestroy {
    

    dataGroup: DataGroupViewModel;
    transformPlugin: SelectTransformPlugin;
    dataGroupId: number;


    constructor(private route: ActivatedRoute,
                private router: Router,
                private pluginsService: TransformPluginsService,
                private dataGroupService: DataGroupsService) {
    }
    
    ngOnInit(): void {
        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.dataGroupId = +params.dataGroupId;
                this.transformPlugin = this.pluginsService.get(this.dataGroupId);
                this.dataGroup = this.dataGroupService.get(this.dataGroupId);
            });
    
    }    
    
    ngOnDestroy(): void {
    }




}



