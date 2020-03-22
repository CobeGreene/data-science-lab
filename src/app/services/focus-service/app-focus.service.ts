import { FocusService } from './focus.service';
import { FocusAreas } from '../../constants';

export class AppFocusService extends FocusService {
    
    private focus: string;
    
    constructor() {
        super();
        this.focus = FocusAreas.Workspace;
    }

    current(): string {
        return this.focus;
    }    
    
    set(focus: string): void {
        if (this.focus !== focus) {
            this.focus = focus;
            this.focusChanged.next(focus);
        }
    }
    
    pop(): void {
        this.focus = FocusAreas.Workspace;
        this.focusChanged.next(this.focus);
    }

}

