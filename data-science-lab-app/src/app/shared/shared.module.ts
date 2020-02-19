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

@NgModule({
    declarations: [
        ModalComponent,
        ModalHeaderComponent,
        ModalCloseComponent,
        CreateExperimentComponent
    ],
    imports: [
        CommonModule,
        AngularFontAwesomeModule,
        FormsModule,
        AngularResizedEventModule,
        ReactiveFormsModule,
        OverlayModule,
    ],
    exports: [
        ModalComponent,
        ModalHeaderComponent,
        ModalCloseComponent,
        CreateExperimentComponent,
        CommonModule,
        AngularFontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        AngularResizedEventModule,
    ]
})
export class SharedModule {

}
