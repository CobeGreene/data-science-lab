import { NgModule } from '@angular/core';
import { DatasetComponent } from './dataset.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { DatasetSelectFetchComponent } from './dataset-select-fetch/dataset-select-fetch.component';
import { DatasetRoutingModule } from './dataset-routing.module';
import { DatasetSetupFetchComponent } from './dataset-setup-fetch/dataset-setup-fetch.component';


@NgModule({
    declarations: [
        DatasetComponent,
        DatasetSelectFetchComponent,
        DatasetSetupFetchComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DatasetRoutingModule,
    ]
})
export class DatasetModule {

}
