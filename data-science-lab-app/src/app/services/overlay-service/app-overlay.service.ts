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
    }

    register(component: OverlayComponent) {
        if (this.component) {
            this.component.close();
        }

        this.component = component; 
        this.focusService.set(FocusAreas.Overlay);
    }
    
    close() {
        if (this.component) {
            this.component.close();
            this.focusService.pop();
        }
        this.component = undefined;
    }
}
