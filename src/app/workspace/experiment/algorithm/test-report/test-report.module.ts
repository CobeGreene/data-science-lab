import { NgModule } from "@angular/core";
import { TestReportComponent } from "./test-report.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../../../shared/shared.module";
import { TestReportRoutingModule } from "./test-report-routing.module";
import { TestReportSelectVisualizeComponent } from './test-report-select-visualize/test-report-select-visualize.component';
import { TestReportInputsVisualizeComponent } from './test-report-inputs-visualize/test-report-inputs-visualize.component';
import { TestReportSetupVisualizeComponent } from './test-report-setup-visualize/test-report-setup-visualize.component';

@NgModule({
    declarations: [
        TestReportComponent,
        TestReportSelectVisualizeComponent,
        TestReportInputsVisualizeComponent,
        TestReportSetupVisualizeComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        TestReportRoutingModule
    ]
})
export class TestReportModule {

}