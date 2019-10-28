import { MockPackageProducer } from '../../producers';
import { MockSettingService } from '../setting-services';
import { MockWebService } from '../web-services';
import { MockPluginManagerAdapter } from '../../adapters';
import { AppPackageService } from './app-package.service';
import { PluginPackageList, PluginPackage } from '../../../../shared/models';
import { Request, Response } from 'data-science-lab-core';
import { ApiSettings } from '../../models';

describe('Electron App Package Service Tests', () => {
    let packageProducer: MockPackageProducer;
    let settingService: MockSettingService;
    let webService: MockWebService;
    let pluginManager: MockPluginManagerAdapter;
    let appPackageService: AppPackageService;
    let pluginList: PluginPackageList;

    beforeAll(() => {
        packageProducer = new MockPackageProducer();
        settingService = new MockSettingService();
        webService = new MockWebService();
        pluginManager = new MockPluginManagerAdapter();
    });

    beforeEach(() => {
        pluginList = new PluginPackageList([
            new PluginPackage({
                name: 'name1',
                owner: 'owner1',
                username: 'username1',
                repositoryName: 'repositoryName1',
            }),
            new PluginPackage({
                name: 'name2',
                owner: 'owner2',
                username: 'username2',
                repositoryName: 'repositoryName2',
            }),
            new PluginPackage({
                name: 'name3',
                owner: 'owner3',
                username: 'username3',
                repositoryName: 'repositoryName3',
            }),
        ]);
        settingService.reset();
        settingService.set('api-settings', new ApiSettings());
        webService.reset();
        pluginManager.reset();
        packageProducer.reset();
        webService.send = (request: Request): Promise<Response> => {
            return new Promise<Response>((resolve) => {
                setTimeout(() => {
                    const json = JSON.stringify(pluginList.packages);
                    const buf = Buffer.from(json, 'utf8');
                    resolve(new Response({
                        statusCode: 200,
                        body: buf
                    }));
                }, 20);
            });
        };
    });

    it('all should return [] and fetch from the server', (done) => {
        appPackageService = new AppPackageService(packageProducer,
            settingService, webService, pluginManager);
        let count = 0;
        packageProducer.all = (list) => {
            if (list.packages.length === 0) {
                expect(count).toBe(0);
                count += 1;
            } else {
                expect(list.packages.length).toBe(pluginList.packages.length);
                done();
            }
        };
        appPackageService.all();
    });

    it('all should return with one plugin install from the server', (done) => {
        const pluginPackage = pluginList.packages[0];
        pluginPackage.install = true;
        settingService.set(AppPackageService.INSTALL_PACKAGES, new PluginPackageList([
            pluginPackage
        ]));
        appPackageService = new AppPackageService(packageProducer,
            settingService, webService, pluginManager);
        let count = 0;
        packageProducer.all = (list) => {
            if (list.packages.length === 0) {
                done.fail('Should have return packages with length greather than 1');
            } else if (list.packages.length === 1) {
                expect(count).toBe(0);
                count += 1;
            } else {
                expect(list.packages.length).toBe(pluginList.packages.length);
                done();
            }
        };
        appPackageService.all();
    });

    it('install should throw error for no packages', () => {
        appPackageService = new AppPackageService(packageProducer,
            settingService, webService, pluginManager);
        expect(() => {
            appPackageService.install('not-found');
        }).toThrowError();
    });

    it('uninstall should throw error for no packages', () => {
        appPackageService = new AppPackageService(packageProducer,
            settingService, webService, pluginManager);
        expect(() => {
            appPackageService.uninstall('not-found');
        }).toThrowError();
    });

    it('install should update settings package list', (done) => {
        appPackageService = new AppPackageService(packageProducer,
            settingService, webService, pluginManager);
        webService.send = (request: Request): Promise<Response> => {
            return new Promise<Response>((resolve) => {
                const json = JSON.stringify(pluginList.packages);
                const buf = Buffer.from(json, 'utf8');
                setTimeout(() => {
                    packageProducer.all = (_) => {
                        const li = settingService.get<PluginPackageList>(AppPackageService.INSTALL_PACKAGES);
                        expect(li.packages.length).toBe(1);
                        done();
                    };
                    appPackageService.install(pluginList.packages[0].name);
                }, 5);
                resolve(new Response({
                    statusCode: 200,
                    body: buf
                }));
            });
        };
        appPackageService.all();
    });

    it('uninstall should update settings package list', (done) => {
        const pluginPackage = pluginList.packages[0];
        pluginPackage.install = true;
        settingService.set(AppPackageService.INSTALL_PACKAGES, new PluginPackageList([
            pluginPackage
        ]));
        appPackageService = new AppPackageService(packageProducer,
            settingService, webService, pluginManager);
        packageProducer.all = (_) => {
            const li = settingService.get<PluginPackageList>(AppPackageService.INSTALL_PACKAGES);
            expect(li.packages.length).toBe(0);
            done();
        };
        appPackageService.uninstall(pluginList.packages[0].name);
    });

});

