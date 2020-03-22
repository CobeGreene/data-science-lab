import { AppOverlayService } from './app-overlay.service';
import { FocusService } from '../focus-service';
import { FocusAreas } from '../../constants';
import { Subject } from 'rxjs';

describe('Angular App Overlay Service', () => {
    let service: AppOverlayService;
    let focusService: FocusService;

    beforeEach(() => {
        focusService = {
            focusChanged: new Subject<string>(),
            set: () => {},
            current: () => '',
            pop: () => {}
        };
        service = new AppOverlayService(focusService);
    });

    it('should close even when no component register', () => {
        service.close();
        expect().nothing();
    });

    it('should set focus service to overlay when component register', (done) => {
        const component = jasmine.createSpyObj('OverlayComponent', ['close']);
        focusService.set = (focus) => {
            expect(focus).toBe(FocusAreas.Overlay);
            done();
        };
        service.register(component);
    });
    
    it('should close component when requested to close', () => {
        const component = jasmine.createSpyObj('OverlayComponent', ['close']);
        service.register(component);
        service.close();
        expect(component.close as jasmine.Spy).toHaveBeenCalled();        
    });

    it('should pop focus service when requested to close', (done) => {
        const component = jasmine.createSpyObj('OverlayComponent', ['close']);
        service.register(component);
        focusService.pop = () => {
            expect().nothing();
            done();
        };
        service.close();
    });

    it('should close component if focus change', () => {
        const component = jasmine.createSpyObj('OverlayComponent', ['close']);
        service.register(component);
        focusService.focusChanged.next(FocusAreas.Workspace);
        expect(component.close).toHaveBeenCalled();
    });
});
