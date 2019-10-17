import { NgModule } from '@angular/core';
import { PluginsSidebarComponent } from './plugins-sidebar/plugins-sidebar.component';
import { PluginsRoutingModule } from './plugins-routing.module';
import { Plugin } from '../../../shared/models/plugin';
import { MockPluginService } from '../services/plugin-services/mock-plugin.service';
import { PluginService } from '../services/plugin-services/plugin.service';
import { PluginsComponent } from './plugins.component';
import { PluginsAvailableComponent } from './plugins-available/plugins-available.component';
import { PluginsInstalledComponent } from './plugins-installed/plugins-installed.component';
import { PluginCardComponent } from './plugin-card/plugin-card.component';
import { PluginDetailsComponent } from './plugin-details/plugin-details.component';
import { CommonModule } from '@angular/common';
import { AppPluginService } from '../services/plugin-services/app-plugin.service';

// const pluginService = MockPluginService.init([
//     new Plugin('name', 'owner', 'repo'),
//     new Plugin('name2', 'owner2', 'repo2'),
//     new Plugin('name3', 'owner', 'repo3', true)
//   ]);

@NgModule({
    declarations: [
        PluginsComponent,
        PluginsSidebarComponent,
        PluginsAvailableComponent,
        PluginsInstalledComponent,
        PluginCardComponent,
        PluginDetailsComponent
    ],
    imports: [
        CommonModule,
        PluginsRoutingModule
    ],
    providers: [
        {provide: PluginService, useClass: AppPluginService },
      ],
})
export class PluginsModule {

}
