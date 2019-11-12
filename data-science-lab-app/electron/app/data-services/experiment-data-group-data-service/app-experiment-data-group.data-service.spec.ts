import { AppExperimentDataGroupDataService } from './app-experiment-data-group.data-service';
import { ExperimentDataGroup } from '../../models';


describe('Electron App Experiment Data Group Data Serivice Tests', () => {
    let dataGroupDataService: AppExperimentDataGroupDataService;

    beforeEach(() => {
        dataGroupDataService = new AppExperimentDataGroupDataService();
    });

    it('all should return empty list', () => {
        const groups = dataGroupDataService.all();
        expect(groups.length).toEqual(0);
    });

    it('all should return two after created twice', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        expect(dataGroupDataService.all().length).toEqual(2);
    });

    it('all should return one data group for experiment id 2', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1',
            experimentId: 2
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2',
            experimentId: 1
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '3',
            experimentId: 2
        }));
        expect(dataGroupDataService.all(1).length).toEqual(1);
    });

    it('create should create with id one', () => {
        const dataGroup  = dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        expect(dataGroup.id).toBe(1);
    });

    it('create should create a second with id two', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1',
            experimentId: 2
        }));
        const dataGroup  = dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        expect(dataGroup.id).toBe(2);
    });


    it('read should throw for no data groups', () => {
        expect(() => {
            dataGroupDataService.read(404);
        }).toThrowError();
    });

    it('read should throw with non existent data even with groups', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        expect(() => {
            dataGroupDataService.read(404);
        }).toThrowError();
    });
    
    it('read should return data group', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        expect(dataGroupDataService.read(1).label).toEqual('1');
    });
   
    it('update should throw for no data groups', () => {
        expect(() => {
            dataGroupDataService.update(new ExperimentDataGroup({
                id: 404, label: '1'
            }));
        }).toThrowError();
    });

    it('update should throw with non existent data even with groups', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        expect(() => {
            dataGroupDataService.update(new ExperimentDataGroup({
                id: 404,
                label: '3'
            }));
        }).toThrowError();
    });
    
    it('update should update data group', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        dataGroupDataService.update(new ExperimentDataGroup({
            id: 1,
            label: '3'
        }));
        expect(dataGroupDataService.read(1).label).toEqual('3');
    });

    it('delete should decrease the length of list', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.delete(1);
        expect(dataGroupDataService.all().length).toBe(0);
    });

    it('delete should throw for no data groups', () => {
        expect(() => {
            dataGroupDataService.delete(404);
        }).toThrowError();
    });

    it('delete should throw with non existent data even with groups', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1'
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2'
        }));
        expect(() => {
            dataGroupDataService.delete(404);
        }).toThrowError();
    });

    it('delete by experiment should remove all in experiment', () => {
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '1',
            experimentId: 2
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '2',
            experimentId: 1
        }));
        dataGroupDataService.create(new ExperimentDataGroup({
            label: '3',
            experimentId: 2
        }));
        dataGroupDataService.deleteByExperiment(2);
        expect(dataGroupDataService.all().length).toBe(1);        
    });

});
