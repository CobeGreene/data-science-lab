import { NgModule } from '@angular/core';
import { AlgorithmComponent } from './algorithm.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { AlgorithmRoutingModule } from './algorithm-routing.module';
import { AlgorithmDatasetCreateComponent } from './algorithm-dataset-create/algorithm-dataset-create.component';
import { AlgorithmSelectCreateComponent } from './algorithm-select-create/algorithm-select-create.component';
import { AlgorithmInputsCreateComponent } from './algorithm-inputs-create/algorithm-inputs-create.component';
import { AlgorithmSetupCreateComponent } from './algorithm-setup-create/algorithm-setup-create.component';
import { AlgorithmDetailsComponent } from './algorithm-details/algorithm-details.component';
import { AlgorithmHeaderComponent } from './algorithm-details/algorithm-header/algorithm-header.component';
import { AlgorithmTrackersComponent } from './algorithm-details/algorithm-trackers/algorithm-trackers.component';
import { AlgorithmTestReportsComponent } from './algorithm-details/algorithm-test-reports/algorithm-test-reports.component';
import { AlgorithmTestReportCardComponent } from './algorithm-details/algorithm-test-reports/algorithm-test-report-card/algorithm-test-report-card.component';



@NgModule({
    declarations: [
        AlgorithmComponent,
        AlgorithmDatasetCreateComponent,
        AlgorithmSelectCreateComponent,
        AlgorithmInputsCreateComponent,
        AlgorithmSetupCreateComponent,
        AlgorithmDetailsComponent,
        AlgorithmHeaderComponent,
        AlgorithmTrackersComponent,
        AlgorithmTestReportsComponent,
        AlgorithmTestReportCardComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        AlgorithmRoutingModule
    ]
})
export class AlgorithmModule {

}

