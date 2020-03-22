import { Tab } from '../../models';

export abstract class TabFactory {
    abstract create(routes: any[]): Tab;
}
