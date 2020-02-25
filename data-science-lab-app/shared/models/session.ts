import { SessionOptions } from './session-options';
import { SessionPlugin } from './session-plugin';
import { Plugin } from './plugin';
import { OptionList } from 'data-science-lab-core';

export class Session {
    id: number;
    keyId: number;
    selectedFeatures: number;
    sessionOptions: SessionOptions;
    state: string;
    returnPath?: string;
    isWaiting: boolean;
    plugin: SessionPlugin | Plugin;
    optionList?: OptionList;
    search?: string;
    inputDict?: { [id: string]: number[] };
    inputValues?: {[name: string]: any};
}

