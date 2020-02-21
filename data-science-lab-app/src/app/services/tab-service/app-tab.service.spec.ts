import { TabService } from './tab.service';
import { AppTabService } from './app-tab.service';


describe('Angular App Tab Service', () => {
    let service: TabService;

    beforeEach(() => {
        service = new AppTabService();
    });

    it('all should return empty list', () => {
        expect(service.all().length).toBe(0);
    });

    it('open tab should call tab open with length of 1', (done) => {
        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(tabs.length).toBe(1);
            done();
        });

        service.openTab({
            name: 'Name',
            route: '/route',
        });
    });

    it('open tab should call tab open with index of 0', (done) => {
        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(index).toBe(0);
            done();
        });

        service.openTab({
            name: 'Name',
            route: '/route',
        });
    });

    it('open same tab should call tab open with length of 1', (done) => {
        service.openTab({
            name: 'Name',
            route: '/route',
        });

        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(tabs.length).toBe(1);
            done();
        });

        service.openTab({
            name: 'Name',
            route: '/route',
        });
    });

    it('open same tab should call tab open with index of 0', (done) => {
        service.openTab({
            name: 'Name',
            route: '/route',
        });

        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(index).toBe(0);
            done();
        });

        service.openTab({
            name: 'Name',
            route: '/route',
        });
    });

    it('open same tab should call tab open with different name', (done) => {
        service.openTab({
            name: 'Name',
            route: '/route',
        });

        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(tabs[index].name).toBe('New Name');
            done();
        });

        service.openTab({
            name: 'New Name',
            route: '/route',
        });
    });

    it('open same tab should call tab open with different name event with multiple tabs', (done) => {
        service.openTab({
            name: 'Name',
            route: '/route',
        });

        service.openTab({
            name: 'Name2',
            route: '/route2',
        });

        service.openTab({
            name: 'Name3',
            route: '/route3',
        });

        service.openTab({
            name: 'Name3',
            route: '/route4',
        });

        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(index).toBe(3);
            expect(tabs.length).toBe(4);
            expect(tabs[index].name).toBe('New Name');
            done();
        });

        service.openTab({
            name: 'New Name',
            route: '/route4',
        });
    });

    it('open same tab should call close of tab', (done) => {
        service.openTab({
            name: 'Name',
            route: '/route',
            close: () => {
                expect().nothing();
                done();
            }
        });

        service.openTab({
            name: 'New Name',
            route: '/route'
        });
    });

    it('open same tab should call close of tab', () => {
        const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        service.openTab({
            name: 'Name',
            route: '/route',
            sub
        });

        service.openTab({
            name: 'New Name',
            route: '/route'
        });

        expect(sub.unsubscribe).toHaveBeenCalled();
    });

    it('replace tab should throw if can\'t find tab', () => {
        expect(() => {
            service.replaceTab('/route', {
                route: '/route',
                name: 'Name'
            });
        }).toThrowError();
    });

    it('replace should throw if can\t find tab amoung tabs', () => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name'
        });

        expect(() => {
            service.replaceTab('/route', {
                route: '/route',
                name: 'Name'
            });
        }).toThrowError();
    });

    it('replace should call tab replace with different tab', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });

        service.tabReplaced.subscribe(({ index, tabs }) => {
            expect(index).toBe(0);
            expect(tabs.length).toBe(1);
            expect(tabs[0].name).toBe('New Name');
            expect(tabs[0].route).toBe('/route2');
            done();
        });

        service.replaceTab('/route1', {
            name: 'New Name',
            route: '/route2'
        });
    });

    it('replace should call tab replace with different tab among tabs', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name'
        });

        service.tabReplaced.subscribe(({ index, tabs }) => {
            expect(index).toBe(1);
            expect(tabs.length).toBe(3);
            expect(tabs[index].name).toBe('New Name');
            expect(tabs[index].route).toBe('/route4');
            done();
        });

        service.replaceTab('/route2', {
            name: 'New Name',
            route: '/route4'
        });
    });

    it('replace should call tab close', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name',
            close: () => {
                expect().nothing();
                done();
            }
        });

        service.replaceTab('/route1', {
            name: 'New Name',
            route: '/route2'
        });
    });

    it('replace should call tab unsubscribe', () => {
        const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        service.openTab({
            route: '/route1',
            name: 'Name',
            sub
        });

        service.replaceTab('/route1', {
            name: 'New Name',
            route: '/route2'
        });

        expect(sub.unsubscribe).toHaveBeenCalled();
    });

    it('replace with another tab should call tab opened', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name'
        });

        service.tabReplaced.subscribe(({ index, tabs }) => {
            expect(index).toBe(1);
            expect(tabs.length).toBe(2);
            expect(tabs[index].name).toBe('New Name');
            expect(tabs[index].route).toBe('/route3');
            done();
        });

        service.replaceTab('/route2', {
            name: 'New Name',
            route: '/route3'
        });
    });
    
    it('replace with another tab should call done on already open', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
            close: () => {
                expect().nothing();
                done();
            }
        });

        service.replaceTab('/route2', {
            name: 'New Name',
            route: '/route3'
        });
    });
    
    it('replace with another tab should call sub on already open', () => {
        const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);
        
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
            sub
        });

        service.replaceTab('/route2', {
            name: 'New Name',
            route: '/route3'
        });

        expect(sub.unsubscribe).toHaveBeenCalled();
    });

    it('replace with another tab should call tab replaced for same route', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name'
        });

        service.tabReplaced.subscribe(({ index, tabs }) => {
            expect(index).toBe(2);
            expect(tabs.length).toBe(3);
            expect(tabs[index].name).toBe('New Name');
            expect(tabs[index].route).toBe('/route3');
            done();
        });

        service.replaceTab('/route3', {
            name: 'New Name',
            route: '/route3'
        });
    });

    it('replace with another tab should call close current', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
            close: () => {
                expect().nothing();
                done();
            }
        });

        service.replaceTab('/route3', {
            name: 'New Name',
            route: '/route3'
        });
    });

    it('replace with another tab should call unsubscribe', () => {
        const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
            sub
        });

        service.replaceTab('/route3', {
            name: 'New Name',
            route: '/route3'
        });

        expect(sub.unsubscribe).toHaveBeenCalled();
    });


    it('remove should call tabs changed', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        service.tabsChanged.subscribe(tabs => {
            expect(tabs.length).toBe(2);
            done();
        });

        service.removeTab('/route2');
    });

    it('remove should throw for no tabs', () => {
        expect(() => {
            service.removeTab('/route1');
        }).toThrowError();
    });

    it('remove should throw with tabs', () => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name'
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        expect(() => {
            service.removeTab('/route4');
        }).toThrowError();
    });

    it('remove tab should call close on remove tab', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name',
            close: () => {
                expect().nothing();
                done();
            }
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        service.removeTab('/route2');
    });

    it('remove tab should call subscribe', () => {
        const sub = jasmine.createSpyObj('Subscription', ['unsubscribe']);

        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name',
            sub
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        service.removeTab('/route2');

        expect(sub.unsubscribe).toHaveBeenCalled();
    });

    it('find or default should find with route', () => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name 2',
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        const tab = service.findOrDefault('/route2');

        expect(tab.name).toBe('Name 2');
    });

    it('find or default should find undefined for unknown route', () => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name 2',
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        const tab = service.findOrDefault('/route4');

        expect(tab).toBe(undefined);
    });


    it('reopen tab should call tab open for tab', (done) => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name 2',
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });

        service.tabOpened.subscribe(({ index, tabs }) => {
            expect(index).toBe(1);
            expect(tabs.length).toBe(3);
            done();
        });

        service.reopenTab('/route2');
    });

    it('reopen tab should throw for unknown tab', () => {
        service.openTab({
            route: '/route1',
            name: 'Name'
        });
        service.openTab({
            route: '/route2',
            name: 'Name 2',
        });
        service.openTab({
            route: '/route3',
            name: 'Name',
        });
        
        expect(() => {
            service.reopenTab('/route4');
        }).toThrowError();
    });








});

