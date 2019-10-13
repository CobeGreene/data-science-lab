import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { PluginsComponent } from './plugins/plugins.component';

const appRoutes: Routes = [
    { path: '', component: WelcomeComponent, pathMatch: 'full' },
    { path: 'plugins', component: PluginsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
