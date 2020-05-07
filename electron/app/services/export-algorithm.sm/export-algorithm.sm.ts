import { ServiceContainer, SERVICE_TYPES } from '../../service-container';
import { Producer, ServiceModelRoutes } from '../../pipeline';
import { AlgorithmEvents, ErrorEvent } from '../../../../shared/events';
import { ServiceModel } from '../service-model';
import { AlgorithmDataService } from '../../data-services/algorithm-data-service';
import { AlgorithmObject } from '../../models';
import { dialog } from 'electron';
import { PackageDataService } from '../../data-services/package-data-service';
import * as fs from 'fs';
import { Package } from '../../../../shared/models';
import { PluginDataInput } from 'data-science-lab-core';


export class ExportAlgorithmServiceModel extends ServiceModel {
    static routes: ServiceModelRoutes = {
        service: SERVICE_TYPES.ExportAlgorithmServiceModel,
        routes: [
            { path: AlgorithmEvents.Export, method: 'export' }
        ]
    };

    private algorithmService: AlgorithmDataService;
    private packageService: PackageDataService;

    constructor(serviceContainer: ServiceContainer, producer: Producer) {
        super(serviceContainer, producer);

        this.algorithmService = serviceContainer.resolve<AlgorithmDataService>(SERVICE_TYPES.AlgorithmDataService);
        this.packageService = serviceContainer.resolve<PackageDataService>(SERVICE_TYPES.PackageDataService);
    }

    async export(id: number, language: string) {
        const algorithm = this.algorithmService.get(id);
        const pluginPackage = this.packageService.find(algorithm.plugin);
        const json = await this.algorithmService.export(id);
        switch (language.toLowerCase()) {
            case "javascript":
                await this.exportJavascript(algorithm, pluginPackage, json);
                break;
            case "typescript":
                await this.exportTypescript(algorithm, pluginPackage, json);
                break;
            default:
                this.producer.send(ErrorEvent, new Error(`Data Science Lab doesn't support ${language} for export.`))
                break;
        }
    }

    constructFormat(dataInputs: PluginDataInput[]) {
        let str = '{ ';
        for (let dataInput of dataInputs) {
            str += `"${dataInput.id}": ${dataInput.type}[], `;
        }
        str += '}';
        return str;
    }

    testingInput(algorithm: AlgorithmObject): { input: string, output: string } {
        const { input, output } = algorithm.algorithm.getTestingInputs();
        return {
            input: this.constructFormat(input),
            output: this.constructFormat(output),
        }
    }

    async exportJavascript(algorithm: AlgorithmObject, pluginPackage: Package, json: string) {
        const { input, output } = this.testingInput(algorithm);
        const path = await dialog.showSaveDialog({
            title: 'Export file as',
            filters: [
                { name: 'Javascript File', extensions: ['js'] }
            ]
        });
        if (!!path && !path.canceled) {
            fs.writeFileSync(path.filePath,
                `/*
    Data Science Lab

    To use the exported algorithm, install the repo ${pluginPackage.owner}/${pluginPackage.repositoryName}.
    Two items below:

    1. An IFFY that imports
    the algorithm from json that the algorithm
    provided to retain its state from being trained.
    Note that it's async, and some algorithms made take
    a while to import. 

    2. A prediction function
    that expects the arguments in the following format:
    ${input}
    and returns in the following format:
    ${output}
    
*/
const dsl = require('${pluginPackage.repositoryName}');

let algorithm = null;
(async () => {
    algorithm = await (new dsl.${algorithm.plugin.className}()).import(
        \`${json}\`,
        true);
})();

function predict(argument) {
    return algorithm.test(argument);
}

module.exports = predict;
`);
        }
    }

    async exportTypescript(algorithm: AlgorithmObject, pluginPackage: Package, json: string) {
        const path = await dialog.showSaveDialog({
            title: 'Export file as',
            filters: [
                { name: 'Typescript File', extensions: ['ts'] }
            ]
        });
        if (!!path && !path.canceled) {
            fs.writeFileSync(path.filePath,
                `/*
    Data Science Lab

    To use the exported algorithm, install the repo ${pluginPackage.owner}/${pluginPackage.repositoryName}.
    Two items below:

    1. An IFFY that imports
    the algorithm from json that the algorithm
    provided to retain its state from being trained.
    Note that it's async, and some algorithms made take
    a while to import. 

    2. A prediction function
    that expects the arguments in the following format:
    ${algorithm.algorithm.getTestingInputs().input}
    and returns in the following format:
    ${algorithm.algorithm.getTestingInputs().output}

    */
    import { ${algorithm.plugin.className} } from '${pluginPackage.repositoryName}';

    let algorithm = null;
    (async () => {
        algorithm = await (new ${algorithm.plugin.className}()).import(
        \`${json}\`,
        true);
    })();

    export function predict(argument) {
        return algorithm.test(argument);
    }
`);

        }
    }
}

