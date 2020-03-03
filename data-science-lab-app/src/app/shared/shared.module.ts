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
import { PluginBodyComponent } from './plugin/plugin-body/plugin-body.component';
import { PluginHeaderComponent } from './plugin/plugin-header/plugin-header.component';
import { PluginSelectionComponent } from './plugin/plugin-selection/plugin-selection.component';
import { PluginSetupComponent } from './plugin/plugin-setup/plugin-setup.component';
import { PluginInputComponent } from './plugin/plugin-input/plugin-input.component';
import { PluginFeaturesComponent } from './plugin/plugin-features/plugin-features.component';
import { PluginNextComponent } from './plugin/plugin-body/plugin-next/plugin-next.component';
import { ObjectCardComponent } from './object-card/object-card.component';
import { PluginExitComponent } from './plugin/plugin-header/plugin-exit/plugin-exit.component';
import { PluginReturnComponent } from './plugin/plugin-header/plugin-return/plugin-return.component';
import { PluginInputValidComponent } from './plugin/plugin-input/plugin-input-valid/plugin-input-valid.component';
import { PopupComponent } from './popup/popup.component';
import { PluginSelectionListComponent } from './plugin/plugin-selection/plugin-selection-list/plugin-selection-list.component';
import { PluginSelectionSearchComponent } from './plugin/plugin-selection/plugin-selection-search/plugin-selection-search.component';
import {
    PluginSelectionBoxComponent
} from './plugin/plugin-selection/plugin-selection-list/plugin-selection-box/plugin-selection-box.component';
import {
    PluginSelectionCardComponent
} from './plugin/plugin-selection/plugin-selection-list/plugin-selection-card/plugin-selection-card.component';
import { CheckboxOptionComponent } from './plugin/plugin-setup/checkbox-option/checkbox-option.component';
import { ChoicesOptionComponent } from './plugin/plugin-setup/choices-option/choices-option.component';
import { CommandOptionComponent } from './plugin/plugin-setup/command-option/command-option.component';
import { NumberOptionComponent } from './plugin/plugin-setup/number-option/number-option.component';
import { TextOptionComponent } from './plugin/plugin-setup/text-option/text-option.component';
import { PluginSearchPipe } from './pipes/plugin-search.pipe';
import { EditDatasetComponent } from './dataset/edit-dataset/edit-dataset.component';
import { DeleteDatasetComponent } from './dataset/delete-dataset/delete-dataset.component';
import { SplitDatasetComponent } from './dataset/split-dataset/split-dataset.component';

@NgModule({
    declarations: [
        ModalComponent,
        ModalHeaderComponent,
        ModalCloseComponent,
        CreateExperimentComponent,
        IncompletePipe,
        PackageBadgePipe,
        PackageSearchPipe,
        PluginSearchPipe,
        NotificationComponent,
        DropdownComponent,
        SelectComponent,
        CheckboxComponent,
        UpdateExperimentComponent,
        DeleteExperimentComponent,
        PluginBodyComponent,
        PluginHeaderComponent,
        PluginSelectionComponent,
        PluginSetupComponent,
        PluginInputComponent,
        PluginFeaturesComponent,
        PluginNextComponent,
        ObjectCardComponent,
        PluginExitComponent,
        PluginReturnComponent,
        PluginInputValidComponent,
        PopupComponent,
        PluginSelectionListComponent,
        PluginSelectionSearchComponent,
        PluginSelectionBoxComponent,
        PluginSelectionCardComponent,
        CheckboxOptionComponent,
        ChoicesOptionComponent,
        CommandOptionComponent,
        NumberOptionComponent,
        TextOptionComponent,
        EditDatasetComponent,
        DeleteDatasetComponent,
        SplitDatasetComponent,
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
        EditDatasetComponent,
        DeleteDatasetComponent,
        SplitDatasetComponent,
        IncompletePipe,
        PackageBadgePipe,
        PackageSearchPipe,
        DropdownComponent,
        PluginSelectionComponent,
        PluginSetupComponent,
        PluginInputComponent,
        PluginFeaturesComponent,
        PluginHeaderComponent,
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
