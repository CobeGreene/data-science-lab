import { NgModule } from '@angular/core';
import { DatasetComponent } from './dataset.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DatasetSelectFetchComponent } from './dataset-select-fetch/dataset-select-fetch.component';
import { DatasetRoutingModule } from './dataset-routing.module';
import { DatasetSetupFetchComponent } from './dataset-setup-fetch/dataset-setup-fetch.component';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';
import { DatasetHeaderComponent } from './dataset-details/dataset-header/dataset-header.component';
import { DatasetFeaturesComponent } from './dataset-details/dataset-features/dataset-features.component';
import { DatasetExamplesComponent } from './dataset-details/dataset-examples/dataset-examples.component';


@NgModule({
    declarations: [
        DatasetComponent,
        DatasetSelectFetchComponent,
        DatasetSetupFetchComponent,
        DatasetDetailsComponent,
        DatasetHeaderComponent,
        DatasetFeaturesComponent,
        DatasetExamplesComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DatasetRoutingModule,
    ]
})
export class DatasetModule {

}
