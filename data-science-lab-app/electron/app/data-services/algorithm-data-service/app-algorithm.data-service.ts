import { ExperimentAlgorithmDataService } from './algorithm.data-service';
import { ExperimentAlgorithm } from '../../models';
import { SERVICE_TYPES, ServiceContainer } from '../../services-container';
import { PluginContext } from '../../contexts';

export class AppAlgorithmDataService implements ExperimentAlgorithmDataService {

    private algorithms: ExperimentAlgorithm[];
    private nextId: number;

    constructor(private serviceContainer: ServiceContainer) {
        this.algorithms = [];
        this.nextId = 1;
    }

    all(experimentId?: number): ExperimentAlgorithm[] {
        if (experimentId) {
            return this.algorithms.filter((value) => {
                return value.experimentId === experimentId;
            });
        } else {
            return this.algorithms;
        }
    }

    create(algorithm: ExperimentAlgorithm): ExperimentAlgorithm {
        algorithm.id = this.nextId++;
        this.algorithms.push(algorithm);
        return algorithm;
    }

    read(id: number): ExperimentAlgorithm {
        const find = this.algorithms.find((value) => {
            return value.id === id;
        });
        if (find) {
            return find;
        }
        throw new Error(`Couldn't find experiment algorithm with id ${id}`);
    }

    update(algorithm: ExperimentAlgorithm): void {
        const findIndex = this.algorithms.findIndex((value) => {
            return value.id === algorithm.id;
        });
        if (findIndex >= 0) {
            this.algorithms[findIndex] = algorithm;
        } else {
            throw new Error(`Couldn't find experiment algorithm with id ${algorithm.id}.`);
        }
    }

    delete(id: number): void {
        const findIndex = this.algorithms.findIndex((value) => {
            return value.id === id;
        });
        if (findIndex >= 0) {
            const context = this.serviceContainer.resolve<PluginContext>(SERVICE_TYPES.PluginContext);
            context.deactivate(this.algorithms[findIndex].pluginPackage,
                this.algorithms[findIndex].plugin)
                .then(() => { })
                .catch(() => { });

            this.algorithms.splice(findIndex, 1);
        } else {
            throw new Error(`COuldn't find experiment algorithm with id ${id}`);
        }
    }
    deleteByExperiment(experimentId: number): void {
        this.algorithms.filter((value) => {
            return value.experimentId === experimentId;
        }).map((value) => {
            return value.id;
        }).forEach((value) => {
            this.delete(value);
        });
    }



}

