import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { DataGroupViewModel } from '../../../../../../shared/view-models';


@Component({
    selector: 'app-experiment-preview-data-group',
    templateUrl: './experiment-preview-data-group.component.html',
    styleUrls: []
})
export class ExperimentPreviewDataGroupComponent implements OnInit, OnDestroy {
    
    @Input() dataGroup: DataGroupViewModel;

    constructor() {
        
    }
    
    ngOnDestroy(): void {
    
    }
    
    ngOnInit(): void {
    
    }

}
