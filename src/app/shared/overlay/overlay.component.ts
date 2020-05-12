import { OverlayRef, Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { TemplateRef, ViewContainerRef } from '@angular/core';
import { OverlayService } from '../../services/overlay-service';
import { TemplatePortal } from '@angular/cdk/portal';

export abstract class OverlayComponent {
    overlayRef: OverlayRef | null;

    isOpen: boolean;

    constructor(protected overlay: Overlay,
        protected viewContainerRef: ViewContainerRef,
        protected overlayService: OverlayService) {
        this.isOpen = false;
    }

    protected abstract onOpen(...args: any);
    protected abstract onClose();
    protected abstract templateRef(): TemplateRef<void>;

    protected abstract positionStrategy(mouseEvent: MouseEvent, ...args: any): PositionStrategy;
    protected getWidth(mouseEvent, ...args: any): string | number | undefined {
        return undefined;
    }

    open(mouseEvent: MouseEvent, ...args: any) {
        this.overlayService.register(this);
        this.isOpen = true;
        mouseEvent.preventDefault();
        mouseEvent.stopPropagation();

        const positionStrategy = this.positionStrategy(mouseEvent, ...args);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            minWidth: this.getWidth(mouseEvent, ...args)
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
        this.isOpen = false;
    }
}
