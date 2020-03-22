import { SERVICE_TYPES } from './service-types';
import { ServiceContainer } from './service-container';
import { AppServiceContainer } from './app.service-container';
import { Service } from './service';


describe('Electron App Service Container Tests', () => {
    
    interface IType {
        value(): number;
    }
    
    class MockType extends Service implements IType  {
        value = (): number => {
            return 0;
        }
    }
    
    class MockWithArgType extends Service implements IType {
        constructor(serivceContainer: ServiceContainer, public number: number) {
            super(serivceContainer);
        }
    
        value = (): number => {
            return this.number;
        }
    }
    
    let serviceContainer: ServiceContainer;

    beforeEach(() => {
        serviceContainer = new AppServiceContainer();
    });

    it('add singleton should resolve to same object', () => {
        serviceContainer.addSingleton<IType>(MockType, SERVICE_TYPES.Placeholder);
        const first = serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder);
        first.value = () => 1;
        const second = serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder);
        expect(second.value()).toBe(1);
    });

    it('add transient should resolve two new objects', () => {
        serviceContainer.addTransient<IType>(MockType, SERVICE_TYPES.Placeholder);
        const first = serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder);
        first.value = () => 1;
        const second = serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder);
        expect(second.value()).toBe(0);
    });

    it('resolve should throw if it cannot find service', () => {
        expect(() => {
            serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder);
        }).toThrowError();
    });

    it('add singleton with args should resolve with argument', () => {
        serviceContainer.addSingleton<IType>(MockWithArgType, SERVICE_TYPES.Placeholder);
        const service = serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder, 1);
        expect(service.value()).toBe(1);
    });

    it('add transient with args should resolve with argument', () => {
        serviceContainer.addSingleton<IType>(MockWithArgType, SERVICE_TYPES.Placeholder);
        const service = serviceContainer.resolve<IType>(SERVICE_TYPES.Placeholder, 1);
        expect(service.value()).toBe(1);
    });

});
