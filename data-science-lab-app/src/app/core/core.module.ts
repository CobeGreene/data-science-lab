import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';
import { ShortcutComponent } from './shortcut/shortcut.component';
import { AppShortcutService, ShortcutService } from '../services/shortcut-service';


@NgModule({
    declarations: [
        ShortcutComponent
    ],
    imports: [
        SharedModule,
        KeyboardShortcutsModule
    ],
    exports: [
        KeyboardShortcutsModule,
        ShortcutComponent
    ],
    providers: [
        { provide: ShortcutService, useClass: AppShortcutService },
    ]
})
export class CoreModule {

}
