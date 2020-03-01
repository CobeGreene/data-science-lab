import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatasetComponent } from './dataset.component';
import { DatasetSelectFetchComponent } from './dataset-select-fetch/dataset-select-fetch.component';
import { DatasetSetupFetchComponent } from './dataset-setup-fetch/dataset-setup-fetch.component';

const routes: Routes = [
    {
        path: '', component: DatasetComponent, children: [
            { path: 'fetch/:sessionId/select', component: DatasetSelectFetchComponent },
            { path: 'fetch/:sessionId/setup', component: DatasetSetupFetchComponent },
        ] 
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DatasetRoutingModule {

}
