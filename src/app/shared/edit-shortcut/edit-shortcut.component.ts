import { Component, OnInit, Input, ViewContainerRef, OnDestroy } from "@angular/core";
import { ModalComponent } from "../modal/modal.component";
import { Shortcut } from "../../../../shared/models";
import { Shortcuts } from "../../../../shared/shortcuts";
import { Overlay } from "@angular/cdk/overlay";
import { OverlayService } from "../../services/overlay-service";
import { ShortcutService } from "../../services/shortcut-service";
import { untilComponentDestroyed } from "@w11k/ngx-componentdestroyed";

@Component({
    selector: 'app-edit-shortcut',
    templateUrl: './edit-shortcut.component.html',
    styleUrls: ['./edit-shortcut.component.css']
})
export class EditShortcutComponent extends ModalComponent implements OnInit, OnDestroy {

    shortcut: Shortcut;

    key: string;
    input: string;
    error: string;

    constructor(
        overlay: Overlay, viewContainerRef: ViewContainerRef, overlayService: OverlayService,
        private shortcutService: ShortcutService) {
        super(overlay, viewContainerRef, overlayService);
    }

    ngOnInit() {
        this.shortcutService.shortcutWatcher
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (this.input === undefined && this.invalidKeybinding(value)) {
                    this.error = `keybinding can't be ${value}`;
                } else if (this.input !== undefined && value === Shortcuts.Enter) {
                    if (this.duplicateKeybinding()) {
                        this.error = `keybinding is already being used`;
                    } else {
                        this.updateKeybinding();
                    }
                } else if (this.input !== undefined && this.invalidKeybinding(value)) {
                    this.error = `keybinding can't be ${value}`;
                } else {
                    this.input = value;
                }
            });
    }

    ngOnDestroy() {

    }

    onOpen(key: string) {
        this.input = undefined;
        this.key = key;
        this.error = undefined;
        this.shortcutService.turnOnWatcher();
    }
    
    onClose() {
        this.error = undefined;
        this.shortcutService.turnOffWatcher();
    }

    invalidKeybinding(value: string): boolean {
        return value === Shortcuts.Enter || value.startsWith(Shortcuts.Arrow) || value === Shortcuts.Tab || value === Shortcuts.Escape;
    }

    duplicateKeybinding(): boolean {
        for (var shortcut of this.shortcutService.all()) {
            if (shortcut.key !== this.key && shortcut.value === this.input) {
                return true;
            }
        }
        return false;
    }

    updateKeybinding() {
        const shortcut = this.shortcutService.get(this.key);
        shortcut.value = this.input;
        this.shortcutService.update(shortcut);
        this.overlayService.close();
    }
    

}