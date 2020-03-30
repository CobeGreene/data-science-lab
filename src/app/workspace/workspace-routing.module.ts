import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent } from './workspace.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SettingsComponent } from './settings/settings.component';
import { ShortcutsComponent } from './shortcuts/shortcuts.component';

const routes: Routes = [
    {
        path: '', component: WorkspaceComponent, children: [
            { path: '', component: WelcomeComponent, pathMatch: 'full' },
            { path: 'welcome', component: WelcomeComponent, pathMatch: 'full' },
            { path: 'settings', component: SettingsComponent, pathMatch: 'full' },
            { path: 'shortcuts', component: ShortcutsComponent, pathMatch: 'full' },
            { path: 'experiment', loadChildren: './experiment/experiment.module#ExperimentModule' },
            { path: 'package', loadChildren: './package/package.module#PackageModule' }
        ]
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WorkspaceRoutingModule {

}
