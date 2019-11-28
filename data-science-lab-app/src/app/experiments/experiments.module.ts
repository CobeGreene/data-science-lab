// tslint:disable: max-line-length
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentStartupComponent } from './experiments-startup/experiments-startup.component';
import { ExperimentDetailsModule } from './experiment-details/experiment-details.module';
import { ExperimentService, AppExperimentService } from '../services/experiment-services';
import {
    FetchSessionService, AppFetchSessionService, FetchPluginsService,
    AppFetchPluginsService, AppDataGroupsService, DataGroupsService, TransformPluginsService, AppTransformPluginsService,
    TransformSessionService, AppTransformSessionService, AlgorithmPluginsService, AppAlgorithmPluginsService, AlgorithmSessionService,
    AppAlgorithmSessionService, AlgorithmService, AppAlgorithmService
} from '../services';

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
        { provide: ExperimentService, useClass: AppExperimentService },
        { provide: FetchSessionService, useClass: AppFetchSessionService },
        { provide: FetchPluginsService, useClass: AppFetchPluginsService },
        { provide: DataGroupsService, useClass: AppDataGroupsService },
        { provide: TransformPluginsService, useClass: AppTransformPluginsService },
        { provide: TransformSessionService, useClass: AppTransformSessionService },
        { provide: AlgorithmPluginsService, useClass: AppAlgorithmPluginsService },
        { provide: AlgorithmSessionService, useClass: AppAlgorithmSessionService },
        { provide: AlgorithmService, useClass: AppAlgorithmService }
    ]
})
export class ExperimentsModule {

}

