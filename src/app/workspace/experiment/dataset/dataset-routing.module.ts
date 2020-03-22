import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasetComponent } from './dataset.component';
import { DatasetSelectFetchComponent } from './dataset-select-fetch/dataset-select-fetch.component';
import { DatasetSelectTransformComponent } from './dataset-select-transform/dataset-select-transform.component';
import { DatasetSetupFetchComponent } from './dataset-setup-fetch/dataset-setup-fetch.component';
import { DatasetInputsTransformComponent } from './dataset-inputs-transform/dataset-inputs-transform.component';
import { DatasetSetupTransformComponent } from './dataset-setup-transform/dataset-setup-transform.component';
import { DatasetDetailsComponent } from './dataset-details/dataset-details.component';
import { DatasetSetupVisualizeComponent } from './dataset-setup-visualize/dataset-setup-visualize.component';
import { DatasetInputsVisualizeComponent } from './dataset-inputs-visualize/dataset-inputs-visualize.component';
import { DatasetSelectVisualizeComponent } from './dataset-select-visualize/dataset-select-visualize.component';

const routes: Routes = [
    {
        path: '', component: DatasetComponent, children: [
            { path: 'fetch/:sessionId/select', component: DatasetSelectFetchComponent },
            { path: 'fetch/:sessionId/setup', component: DatasetSetupFetchComponent },
            { path: ':datasetId/transform/:sessionId/select', component: DatasetSelectTransformComponent },
            { path: ':datasetId/transform/:sessionId/input', component: DatasetInputsTransformComponent },
            { path: ':datasetId/transform/:sessionId/setup', component: DatasetSetupTransformComponent },
            { path: ':datasetId/visualize/:sessionId/select', component: DatasetSelectVisualizeComponent },
            { path: ':datasetId/visualize/:sessionId/input', component: DatasetInputsVisualizeComponent },
            { path: ':datasetId/visualize/:sessionId/setup', component: DatasetSetupVisualizeComponent },
            { path: ':datasetId', component: DatasetDetailsComponent }
        ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasetRoutingModule {

}
