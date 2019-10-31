import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperimentsComponent } from './experiments.component';
import { ExperimentsRoutingModule } from './experiments-routing.module';
import { ExperimentStartupComponent } from './experiments-startup/experiment-startup';
import { ExperimentDetailsModule } from './experiment-details/experiment-details.module';
import { ExperimentService, MockExperimentService } from '../services';
import { ExperimentList, Plugin } from '../../../shared/models';

const fetchPlugins = [
    new Plugin({name: 'name', className: 'className',
                description: 'desc', type: 'FETCH', packageName: 'packageName'}),
    new Plugin({name: 'name 2', className: 'className',
                description: 'desc', type: 'FETCH', packageName: 'packageName'}),
    new Plugin({name: 'name 3', className: 'className',
                description: 'desc', type: 'FETCH', packageName: 'packageName'}),
];
const experimentService = MockExperimentService.init(new ExperimentList(), fetchPlugins); 


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

