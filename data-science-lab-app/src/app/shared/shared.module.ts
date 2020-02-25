import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgxMdModule } from 'ngx-md';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { ModalComponent } from './modal/modal.component';
import { ModalHeaderComponent } from './modal/modal-header/modal-header.component';
import { ModalCloseComponent } from './modal/modal-close/modal-close.component';
import { CreateExperimentComponent } from './experiment/create-experiment/create-experiment.component';
import { IncompletePipe } from './pipes/incomplete.pipe';
import { NotificationComponent } from './notification/notification.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { SelectComponent } from './select/select.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { UpdateExperimentComponent } from './experiment/update-experiment/update-experiment.component';
import { DeleteExperimentComponent } from './experiment/delete-experiment/delete-experiment.component';
import { PackageBadgePipe } from './pipes/package-badge.pipe';
import { PackageSearchPipe } from './pipes/package-search.pipe';

@NgModule({
    declarations: [
        ModalComponent,
        ModalHeaderComponent,
        ModalCloseComponent,
        CreateExperimentComponent,
        IncompletePipe,
        PackageBadgePipe,
        PackageSearchPipe,
        NotificationComponent,
        DropdownComponent,
        SelectComponent,
        CheckboxComponent,
        UpdateExperimentComponent,
        DeleteExperimentComponent,
    ],
    imports: [
        CommonModule,
        AngularFontAwesomeModule,
        FormsModule,
        AngularResizedEventModule,
        ReactiveFormsModule,
        OverlayModule,
        HttpClientModule,
        NgxMdModule,
    ],
    entryComponents: [
        NotificationComponent
    ],
    exports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalCloseComponent,
        CreateExperimentComponent,
        UpdateExperimentComponent,
        DeleteExperimentComponent,
        IncompletePipe,
        PackageBadgePipe,
        PackageSearchPipe,
        DropdownComponent,
        SelectComponent,
        CheckboxComponent,
        CommonModule,
        AngularFontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        AngularResizedEventModule,
        HttpClientModule,
        NgxMdModule,
    ]
})
export class SharedModule {

}
