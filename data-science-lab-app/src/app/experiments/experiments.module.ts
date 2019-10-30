import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentStartupComponent } from './experiments-startup/experiment-startup';
import { ExperimentDetailsModule } from './experiment-details/experiment-details.module';
import { ExperimentService, MockExperimentService } from '../services';

const experimentService = new MockExperimentService(); 

@NgModule({
    declarations: [
        ExperimentsComponent,
        ExperimentStartupComponent
    ],
    imports: [
        CommonModule,
        ExperimentsRoutingModule,
        ExperimentDetailsModule 
    ],
    providers: [
        { provide: ExperimentService, useValue: experimentService  } 
    ]
})
export class ExperimentsModule {

}

