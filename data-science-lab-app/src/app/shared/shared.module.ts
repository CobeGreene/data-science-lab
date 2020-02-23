import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@NgModule({
    declarations: [
        ModalComponent,
        ModalHeaderComponent,
        ModalCloseComponent,
        CreateExperimentComponent,
        IncompletePipe,
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
        DropdownComponent,
        SelectComponent,
        CheckboxComponent,
        CommonModule,
        AngularFontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        AngularResizedEventModule,
    ]
})
export class SharedModule {

}
