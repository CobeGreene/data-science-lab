import { OverlayService } from './overlay.service';
import { Injectable } from '@angular/core';
import { FocusService } from '../focus-service';
import { OverlayComponent } from '../../shared/overlay/overlay.component';
import { FocusAreas } from '../../constants';

@Injectable()
export class AppOverlayService extends OverlayService {

    component: OverlayComponent | undefined;

    constructor(private focusService: FocusService) {
        super();

        this.focusService.focusChanged
            .subscribe((value) => {
                if (value !== FocusAreas.Overlay && this.component !== undefined) {
                    this.component.close();
                    this.component = undefined;
                }
            });
    }

    register(component: OverlayComponent) {
        if (this.component !== undefined) {
            this.component.close();
        }

        this.component = component; 
        this.focusService.set(FocusAreas.Overlay);
    }
    
    close() {
        if (this.component !== undefined) {
            this.component.close();
            this.component = undefined;
            this.focusService.pop();
        }
    }
}
