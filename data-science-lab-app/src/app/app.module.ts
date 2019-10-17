import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { PluginsModule } from './plugins/plugins.module';
import { AppIpService } from './services/ip-services/app-ip.service';
import { IpService } from '../../shared/services/ip.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PluginsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: IpService, useClass: AppIpService }
  ]
})
export class AppModule { }
