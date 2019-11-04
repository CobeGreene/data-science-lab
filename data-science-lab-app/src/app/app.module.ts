import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppIpcService } from './services/';
import { IpcService } from '../../shared/services';
import { PackagesModule } from './packages/packages.module';
import { ErrorService, AppErrorService } from './services/error-services';
import { ErrorNotificationsComponent } from './error-exceptions/error-notifications/error-notifications.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExperimentsModule } from './experiments/experiments.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    ErrorNotificationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PackagesModule,
    ExperimentsModule,
    NgbModule
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: IpcService, useClass: AppIpcService },
    { provide: ErrorService, useClass: AppErrorService }
  ]
})
export class AppModule { }
