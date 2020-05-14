import { AppFocusService } from './app-focus.service';
import { FocusAreas } from '../../constants';


describe('Angular App Focus Service', () => {
    let service: AppFocusService;

    beforeEach(() => {
        service = new AppFocusService();
    });

    it('current should have workspace initially', () => {
        expect(service.current()).toEqual(FocusAreas.Workspace);
    });

    it('set should set current to overlay', () => {
        service.set(FocusAreas.Overlay);
        expect(service.current()).toEqual(FocusAreas.Overlay);
    });

    it('set should call subject', (done) => {
        service.focusChanged.subscribe((space) => {
            expect(space).toEqual(FocusAreas.Sidebar);
            done();
        });
        service.set(FocusAreas.Sidebar);
    });

    it('set should not call focus changed when equal', () => {
        service.set(FocusAreas.Sidebar);
        const myFunc = jasmine.createSpy('MyFunc');
        service.focusChanged.subscribe(myFunc);
        service.set(FocusAreas.Sidebar);
        expect(myFunc).toHaveBeenCalledTimes(0);
    });

    it('pop should reset to workspace', () => {
        service.set(FocusAreas.Sidebar);
        service.pop();
        expect(service.current()).toEqual(FocusAreas.Workspace);
    });

    it('pop should call subject', (done) => {
        service.set(FocusAreas.Sidebar);

        service.focusChanged.subscribe((space) => {
            expect(space).toEqual(FocusAreas.Workspace);
            done();
        });

        service.pop();
    });


});

