import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PluginsComponent } from './plugins/plugins.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MockPluginService } from './services/plugin-services/mock-plugin.service';
import { PluginService } from './services/plugin-services/plugin.service';
import { Plugin } from '../../shared/models/plugin';

const pluginService = MockPluginService.init([
  new Plugin('name', 'owner', 'repo'),
  new Plugin('name2', 'owner2', 'repo2'),
  new Plugin('name3', 'owner', 'repo3', true)
]);

@NgModule({
  declarations: [
    AppComponent,
    PluginsComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    {provide: PluginService, useValue: pluginService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
