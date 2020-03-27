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
import { DatasetFeatureHeaderComponent } from './dataset-details/dataset-examples/dataset-feature-header/dataset-feature-header.component';
import { DatasetSelectTransformComponent } from './dataset-select-transform/dataset-select-transform.component';
import { DatasetInputsTransformComponent } from './dataset-inputs-transform/dataset-inputs-transform.component';
import { DatasetSetupTransformComponent } from './dataset-setup-transform/dataset-setup-transform.component';
import { DatasetSelectVisualizeComponent } from './dataset-select-visualize/dataset-select-visualize.component';
import { DatasetInputsVisualizeComponent } from './dataset-inputs-visualize/dataset-inputs-visualize.component';
import { DatasetSetupVisualizeComponent } from './dataset-setup-visualize/dataset-setup-visualize.component';
import { DatasetFeatureCardComponent } from './dataset-details/dataset-features/dataset-feature-card/dataset-feature-card.component';

@NgModule({
    declarations: [
        DatasetComponent,
        DatasetSelectFetchComponent,
        DatasetSetupFetchComponent,
        DatasetDetailsComponent,
        DatasetHeaderComponent,
        DatasetFeaturesComponent,
        DatasetExamplesComponent,
        DatasetFeatureHeaderComponent,
        DatasetSelectTransformComponent,
        DatasetInputsTransformComponent,
        DatasetSetupTransformComponent,
        DatasetSelectVisualizeComponent,
        DatasetInputsVisualizeComponent,
        DatasetSetupVisualizeComponent,
        DatasetFeatureCardComponent,
    ],
    imports: [
        CommonModule,
        SharedModule,
        DatasetRoutingModule,
    ]
})
export class DatasetModule {

}
