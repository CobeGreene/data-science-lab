import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PluginsComponent } from './plugins/plugins.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MockPluginService } from './services/plugin_services/mock_plugin.service';
import { PluginService } from './services/plugin_services/plugin.service';

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
    {provide: PluginService, useClass: MockPluginService }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
