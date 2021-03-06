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
import { JoinDatasetComponent } from './dataset/join-dataset/join-dataset.component';
import { JoinDatasetCardComponent } from './dataset/join-dataset/join-dataset-card/join-dataset-card.component';
import { UnjoinDatasetCardComponent } from './dataset/join-dataset/unjoin-dataset-card/unjoin-dataset-card.component';
import { PreviewCardComponent } from './preview-card/preview-card.component';
import { PreviewPipe } from './pipes/preview.pipe';
import { SelectDatasetComponent } from './dataset/select-dataset/select-dataset.component';
import { SelectDatasetCardComponent } from './dataset/select-dataset/select-dataset-card/select-dataset-card.component';
import { DeleteAlgorithmComponent } from './algorithm/delete-algorithm/delete-algorithm.component';
import { EditAlgorithmComponent } from './algorithm/edit-algorithm/edit-algorithm.component';
import { PackageExplorerLinkComponent } from './package-explorer-link/package-explorer-link.component';
import { DeleteTestReportComponent } from './test-report/delete-test-report/delete-test-report.component';
import { EditTestReportComponent } from './test-report/edit-test-report/edit-test-report.component';
import { DropdownFeatureComponent } from './dataset/dropdown-feature/dropdown-feature.component';
import { RenameFeatureComponent } from './dataset/dropdown-feature/rename-feature/rename-feature.component';
import { OpenExperimentComponent } from './experiment/open-experiment/open-experiment.component';
import { OpenExperimentCardComponent } from './experiment/open-experiment/open-experiment-card/open-experiment-card.component';
import { EditShortcutComponent } from './edit-shortcut/edit-shortcut.component';
import { PreviewModalComponent } from './preview-card/preview-modal/preview-modal.component';
import { PreviewModalBaseComponent } from './preview-card/preview-modal/preview-modal-base/preview-modal-base.component';
import { RenameVisualComponent } from './visual/rename-visual/rename-visual.component';
import { DeleteVisualComponent } from './visual/delete-visual/delete-visual.component';

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
        PreviewPipe,
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
        EditShortcutComponent,
        CommandOptionComponent,
        NumberOptionComponent,
        TextOptionComponent,
        EditDatasetComponent,
        DeleteDatasetComponent,
        SplitDatasetComponent,
        JoinDatasetComponent,
        JoinDatasetCardComponent,
        UnjoinDatasetCardComponent,
        PreviewCardComponent,
        SelectDatasetComponent,
        SelectDatasetCardComponent,
        DeleteAlgorithmComponent,
        EditAlgorithmComponent,
        PackageExplorerLinkComponent,
        DeleteTestReportComponent,
        EditTestReportComponent,
        DropdownFeatureComponent,
        RenameFeatureComponent,
        OpenExperimentComponent,
        OpenExperimentCardComponent,
        PreviewModalComponent,
        PreviewModalBaseComponent,
        RenameVisualComponent,
        DeleteVisualComponent,
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
        OpenExperimentComponent,
        EditDatasetComponent,
        DeleteDatasetComponent,
        SplitDatasetComponent,
        JoinDatasetComponent,
        SelectDatasetComponent,
        DeleteAlgorithmComponent,
        EditAlgorithmComponent,
        EditShortcutComponent,
        IncompletePipe,
        PackageBadgePipe,
        PackageSearchPipe,
        DropdownComponent,
        DropdownFeatureComponent,
        DeleteTestReportComponent,
        EditTestReportComponent,
        PreviewCardComponent,
        PluginSelectionComponent,
        PluginSetupComponent,
        PluginInputComponent,
        PluginFeaturesComponent,
        PluginHeaderComponent,
        ObjectCardComponent,
        SelectComponent,
        CheckboxComponent,
        PopupComponent,
        PackageExplorerLinkComponent,
        RenameVisualComponent,
        DeleteVisualComponent,
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
