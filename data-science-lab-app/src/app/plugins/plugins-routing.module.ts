import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PluginsAvailableComponent } from './plugins-available/plugins-available.component';
import { PluginsInstalledComponent } from './plugins-installed/plugins-installed.component';
import { PluginsComponent } from './plugins.component';
import { PluginDetailsComponent } from './plugin-details/plugin-details.component';

const pluginRoutes: Routes = [
    { path: 'plugins', component: PluginsComponent, children: [
        { path: '', component: PluginsAvailableComponent },
        { path: 'available', component: PluginsAvailableComponent },
        { path: 'installed', component: PluginsInstalledComponent },
        { path: 'details/:name', component: PluginDetailsComponent }
    ]},
];

@NgModule({
    imports: [
        RouterModule.forChild(pluginRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class PluginsRoutingModule {

}
