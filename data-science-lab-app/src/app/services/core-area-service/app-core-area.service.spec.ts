import { AppCoreAreaService } from './app-core-area.service';


describe('Angular App Core Area Service', () => {
    let service: AppCoreAreaService;
    let html: HTMLElement;

    beforeEach(() => {
        html = document.createElement('div');
        service = new AppCoreAreaService();
        service.registerWorkspace(html);
    });

    it('should notify subject when resize occurs', (done) => {
        service.sizeChanged.subscribe(() => {
            expect().nothing();
            done();
        });
        service.resizeEvent();
    });

    it('should return empty area', () => {
        const area = service.getWorkspace();

        expect(area.top).toEqual(0);
        expect(area.left).toEqual(0);
        expect(area.width).toEqual(0);
        expect(area.height).toEqual(0);
    }); 
});
