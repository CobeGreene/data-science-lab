import { SessionOptions } from './session-options';
import { SessionPlugin } from './session-plugin';
import { Plugin } from './plugin';
import { Option } from 'data-science-lab-core';

export class Session {
    id: number;
    keyId: number;
    sessionOptions: SessionOptions;
    state: string;
    selectedFeatures?: number[];
    returnPath?: string;
    isWaiting: boolean;
    plugin?: SessionPlugin | Plugin;
    optionList?: Option[];
    search?: string;
    inputDict?: { [id: string]: number[] };
    inputValues?: {[name: string]: any};
}

