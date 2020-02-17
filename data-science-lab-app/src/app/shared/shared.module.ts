import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
    declarations: [

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
        CommonModule,
        AngularFontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        AngularResizedEventModule,
    ]
})
export class SharedModule {

}
