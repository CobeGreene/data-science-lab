import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { AppVisualDataService } from './app-visual.data-service';
import { SettingsContext } from '../../contexts/settings-context';
import { ServiceContainer, SERVICE_TYPES } from '../../service-container';


describe('Electron App Visual Data Service', () => {
    let visualDatasetService: AppVisualDataService;
    let context: SettingsContext;
    let serviceContainer: ServiceContainer;

    const maxId = 100;
    const experimentPath = path.join(__dirname, 'app-visual-services-folder');

    beforeEach(() => {
        if (!fs.existsSync(experimentPath)) {
            fs.mkdirSync(experimentPath);
        }

        fs.writeFileSync(path.join(experimentPath, `visuals1.gzip`), zlib.gzipSync(
            JSON.stringify([
                {
                    id: 1,
                    experimentId: 1,
                    name: 'Name 1',
                    srcdoc: '',
                    width: 30,
                    height: 30,
                    top: 0,
                    left: 0,
                    zindex: 0,
                },
                {
                    id: 2,
                    experimentId: 1,
                    name: 'Name 2',
                    srcdoc: '',
                    width: 30,
                    height: 30,
                    top: 0,
                    left: 0,
                    zindex: 0,
                },
            ])
        ));

        context = jasmine.createSpyObj('SettingsContext', ['get', 'set']);
        (context.get as jasmine.Spy).and.callFake((key) => {
            if (key === 'visuals') {
                return maxId;
            } else {
                return experimentPath;
            }
        });

        serviceContainer = jasmine.createSpyObj('ServiceContainer', ['resolve']);
        (serviceContainer.resolve as jasmine.Spy).and.callFake((type: SERVICE_TYPES) => {
            if (type === SERVICE_TYPES.SettingsContext) {
                return context;
            }
            throw new Error(`Couldn't resolve type ${type}.`);
        });

        visualDatasetService = new AppVisualDataService(serviceContainer);
        visualDatasetService.configure();
    });

    it('all should return length 0', () => {
        expect(visualDatasetService.all().length).toBe(0);
    });

    it('all should return length 2 after load', () => {
        visualDatasetService.load(1);
        expect(visualDatasetService.all().length).toBe(2);
    });

    it('get should throw for not found', () => {
        expect(() => {
            visualDatasetService.get(404);
        }).toThrow();
    });

    it('update should dthrow for not found', () => {
        expect(() => {
            visualDatasetService.update({
                id: 404,
                experimentId: 1,
                name: 'Name 1',
                srcdoc: '',
                width: 30,
                height: 30,
                top: 0,
                left: 0,
                zindex: 0,
            })
        }).toThrow();
    });

    it('update should change name', () => {
        visualDatasetService.load(1);
        visualDatasetService.update({
            id: 1,
            experimentId: 1,
            name: 'New Name',
            srcdoc: '',
            width: 30,
            height: 30,
            top: 0,
            left: 0,
            zindex: 0,
        });
        const visual = visualDatasetService.get(1);
        expect(visual.name).toBe('New Name');
    });

    it('get should return visual', () => {
        visualDatasetService.load(1);
        const visual = visualDatasetService.get(1);
        expect(visual.name).toBe('Name 1');
    });

    it('delete should throw for not found', () => {
        expect(() => {
            visualDatasetService.delete(404);
        }).toThrow();
    });

    it('delete by experiment should return both ids', () => {
        visualDatasetService.load(1);
        const ids = visualDatasetService.deleteByExperiment(1);

        expect(ids.length).toBe(2);
        expect(ids[0]).toBe(1);
        expect(ids[1]).toBe(2);
    });

    it('delete by experiment should unlink file', () => {
        visualDatasetService.load(1);
        visualDatasetService.deleteByExperiment(1);
        visualDatasetService.save(1);

        expect(fs.existsSync(path.join(experimentPath, 'visuals1.gzip'))).toBeFalsy();
    });

    it('post should add experiment', () => {
        visualDatasetService.post({
            id: 0,
            experimentId: 3,
            name: 'Name 3',
            srcdoc: '',
            width: 30,
            height: 30,
            top: 0,
            left: 0,
            zindex: 0,
        });
        expect(visualDatasetService.all(3).length).toBe(1)
    });

    it('post and save should link file', () => {
        visualDatasetService.post({
            id: 0,
            experimentId: 3,
            name: 'Name 3',
            srcdoc: '',
            width: 30,
            height: 30,
            top: 0,
            left: 0,
            zindex: 0,
        });
        visualDatasetService.save(3);
        expect(fs.existsSync(path.join(experimentPath, 'visuals3.gzip'))).toBeTruthy();
    });

});




