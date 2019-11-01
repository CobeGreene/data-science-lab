// tslint:disable: max-line-length
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentStartupComponent } from './experiments-startup/experiment-startup';
import { ExperimentDetailsModule } from './experiment-details/experiment-details.module';
import { ExperimentService, AppExperimentService, AppExperimentSelectFetchService, ExperimentSelectFetchService, ExperimentSetupInputService, AppExperimentSetupInputService } from '../services';


@NgModule({
    declarations: [
        ExperimentsComponent,
        ExperimentStartupComponent
    ],
    imports: [
        CommonModule,
        ExperimentsRoutingModule,
        ExperimentDetailsModule,
    ],
    providers: [
        { provide: ExperimentService, useClass: AppExperimentService  },
        { provide: ExperimentSelectFetchService, useClass: AppExperimentSelectFetchService },
        { provide: ExperimentSetupInputService, useClass: AppExperimentSetupInputService },
    ]
})
export class ExperimentsModule {

}

