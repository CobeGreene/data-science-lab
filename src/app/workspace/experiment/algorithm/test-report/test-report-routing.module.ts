import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { TestReportComponent } from "./test-report.component";
import { TestReportSelectVisualizeComponent } from "./test-report-select-visualize/test-report-select-visualize.component";
import { TestReportInputsVisualizeComponent } from "./test-report-inputs-visualize/test-report-inputs-visualize.component";
import { TestReportSetupVisualizeComponent } from "./test-report-setup-visualize/test-report-setup-visualize.component";

const routes: Routes = [
    {
        path: ':testReportId', component: TestReportComponent, children: [
            { path: 'visualize/:sessionId/select', component: TestReportSelectVisualizeComponent },
            { path: 'visualize/:sessionId/input', component: TestReportInputsVisualizeComponent },
            { path: 'visualize/:sessionId/setup', component: TestReportSetupVisualizeComponent },
        ]
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestReportRoutingModule {

}