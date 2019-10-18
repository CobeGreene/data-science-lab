import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppIpService } from './services/ip-services/app-ip.service';
import { IpService } from '../../shared/services/ip.service';
import { PackagesModule } from './packages/packages.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PackagesModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: IpService, useClass: AppIpService }
  ]
})
export class AppModule { }
