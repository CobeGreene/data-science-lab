import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayService } from '../../services/overlay-service';
import { TemplatePortal } from '@angular/cdk/portal';

export abstract class OverlayComponent {
    overlayRef: OverlayRef | null;

    constructor(protected overlay: Overlay,
                protected viewContainerRef: ViewContainerRef,
                protected overlayService: OverlayService) {
    }

    protected abstract onOpen(...args: any);
    protected abstract onClose();
    protected abstract templateRef(): TemplateRef<void>;

    protected abstract positionStrategy(mouseEvent: MouseEvent, ...args: any): PositionStrategy;

    open(mouseEvent: MouseEvent, ...args: any) {
        this.overlayService.register(this);
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();

        const positionStrategy = this.positionStrategy(mouseEvent, ...args);
        
        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        this.overlayRef.attach(new TemplatePortal(this.templateRef(), this.viewContainerRef));

        this.onOpen(...args);
    }

    close() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
        this.onClose();
    }
}
