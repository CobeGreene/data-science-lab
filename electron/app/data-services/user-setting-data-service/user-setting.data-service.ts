import { Setting } from '../../../../shared/models';

export interface UserSettingDataService {
    all(): Setting[];
    find(key: string): Setting | undefined;
    update(setting: Setting): void;
}

