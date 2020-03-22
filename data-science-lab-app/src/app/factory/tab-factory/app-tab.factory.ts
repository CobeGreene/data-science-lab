import { Injectable } from '@angular/core';
import { TabFactory } from './tab.factory';
import { Tab } from '../../models';
import { ExperimentTabBuilder } from './experiment-tab.builder';
import { ExperimentService } from '../../services/experiment-service';
import { TabService } from '../../services/tab-service';
import { RoutesHandler } from './routes-handler';
import { FetchDatasetTabBuilder } from './fetch-dataset-tab.builder';
import { TabBuilder } from './tab.builder';
import { FetchSessionService } from '../../session-services/fetch-session-service';
import { TransformSessionService } from '../../session-services/transform-session-service';
import { AlgorithmSessionService } from '../../session-services/algorithm-session-service';
import { DatasetService } from '../../services/dataset-service';
import { AlgorithmService } from '../../services/algorithm-service';
import { DatasetTabBuilder } from './dataset-tab.builder';
import { AlgorithmTabBuilder } from './algorithm-tab.builder';
import { TransformDatasetTabBuilder } from './transform-dataset-tab.builder';
import { CreateAlgorithmTabBuilder } from './create-algorithm-tab.builder';
import { CreateTestReportTabBuilder } from './create-test-report-tab.builder';
import { TestReportSessionService } from '../../session-services/test-report-session-service';
import { DatasetVisualSessionService } from '../../session-services/dataset-visual-session-service';
import { VisualizeDatasetTabBuilder } from './visualize-dataset-tab.builder';
import { VisualizeAlgorithmTabBuilder } from './visualize-algorithm-tab.builder';
import { AlgorithmVisualSessionService } from '../../session-services/algorithm-visual-session-service';

@Injectable()
export class AppTabFactory extends TabFactory {

    constructor(
        private tabService: TabService,
        private experimentService: ExperimentService,
        private datasetService: DatasetService,
        private algorithmService: AlgorithmService,
        private fetchSessionService: FetchSessionService,
        private transformSessionService: TransformSessionService,
        private algorithmSessionService: AlgorithmSessionService,
        private testReportSessionService: TestReportSessionService,
        private datasetVisualSessionService: DatasetVisualSessionService,
        private algorithmVisualSessionService: AlgorithmVisualSessionService
    ) {
        super();
    }

    validRoutes(routes: any[]) {
        if (routes.length === 0) {
            throw new Error(`Invalid route to create tab.`);
        }
    }
    create(routes: any[]): Tab {
        const handler = new RoutesHandler(routes);
        if (handler.get(0) === 'settings') {
            return { name: 'Settings', route: '/settings' };
        } else if (handler.get(0) === 'welcome') {
            return { name: 'Welcome', route: '/welcome' };
        } else if (handler.get(0) === 'package' && !handler.has(1)) {
            return { name: 'Package Explorer', route: '/package' };
        } else if (handler.get(0) === 'package' && handler.has(1)) {
            return { name: handler.get(1) as string, route: `/package/${handler.get(1)}` };
        } else if (handler.get(0) === 'experiment') {
            return this.createExperimentRoute(handler.skip(1));
        } else {
            throw handler.invalidRoute();
        }
    }

    createExperimentRoute(handler: RoutesHandler): Tab {
        if (handler.isNumber(0)) {
            const experimentId = +handler.get(0);
            const experimentTitle = this.experimentService.get(experimentId).title;
            handler.skip(1);

            let builder: TabBuilder = new ExperimentTabBuilder(experimentId, experimentTitle, this.tabService, this)
                .buildUpdate(this.experimentService.experimentUpdated)
                .buildDelete(this.experimentService.experimentDeleted);

            if (handler.has(0)) {
                if (handler.get(0) === 'dataset') {
                    handler.skip(1);
                    builder.buildRoute('dataset');

                    if (handler.get(0) === 'fetch') {
                        builder = new FetchDatasetTabBuilder(+handler.get(1), handler.get(2), builder as ExperimentTabBuilder);
                        builder.buildPrefix('Fetch for ')
                            .buildUpdate(this.fetchSessionService.sessionUpdated)
                            .buildDelete(this.fetchSessionService.sessionDeleted)
                            .buildFinish(this.fetchSessionService.sessionFinished)
                            .buildClose(this.fetchSessionService.attemptDelete);
                        handler.skip(3);
                    } else if (handler.isNumber(0)) {
                        const datasetId = +handler.get(0);
                        const datasetName = this.datasetService.get(datasetId).name;
                        builder = new DatasetTabBuilder(datasetId, datasetName, builder as ExperimentTabBuilder);
                        builder.buildUpdate(this.datasetService.datasetUpdated)
                            .buildDelete(this.datasetService.datasetDeleted);
                        handler.skip(1);

                        if (handler.has(0)) {
                            if (handler.get(0) === 'transform') {
                                builder = new TransformDatasetTabBuilder(+handler.get(1), handler.get(2), builder as DatasetTabBuilder);
                                builder.buildPrefix('Transform for ')
                                    .buildUpdate(this.transformSessionService.sessionUpdated)
                                    .buildDelete(this.transformSessionService.sessionDeleted)
                                    .buildFinish(this.transformSessionService.sessionFinished)
                                    .buildClose(this.transformSessionService.attemptDelete);
                            } else if (handler.get(0) === 'visualize') {
                                builder = new VisualizeDatasetTabBuilder(+handler.get(1), handler.get(2), builder as DatasetTabBuilder);
                                builder.buildPrefix('Visual for ')
                                    .buildUpdate(this.datasetVisualSessionService.sessionUpdated)
                                    .buildDelete(this.datasetVisualSessionService.sessionDeleted)
                                    .buildFinish(this.datasetVisualSessionService.sessionFinished)
                                    .buildClose(this.datasetVisualSessionService.attemptDelete);
                            }

                            handler.skip(3);
                        }
                    }
                } else if (handler.get(0) === 'algorithm') {
                    builder.buildRoute('algorithm');
                    handler.skip(1);

                    if (handler.has(0)) {
                        if (handler.get(0) === 'create' && handler.get(1) === 'dataset') {
                            builder.buildRoute('create')
                                .buildRoute('dataset')
                                .buildPrefix('Algorithm for ');
                            handler.skip(2);
                        } else if (handler.get(0) === 'create') {
                            builder = new CreateAlgorithmTabBuilder(+handler.get(1), handler.get(2), builder as ExperimentTabBuilder);
                            builder.buildPrefix('Algorithm for ')
                                .buildUpdate(this.algorithmSessionService.sessionUpdated)
                                .buildDelete(this.algorithmSessionService.sessionDeleted)
                                .buildFinish(this.algorithmSessionService.sessionFinished)
                                .buildClose(this.algorithmSessionService.attemptDelete);
                            handler.skip(3);
                        } else if (handler.isNumber(0)) {
                            const algorithmId = +handler.get(0);
                            const algorithmName = this.algorithmService.get(algorithmId).name;
                            builder = new AlgorithmTabBuilder(algorithmId, algorithmName, builder as ExperimentTabBuilder);
                            builder.buildUpdate(this.algorithmService.algorithmUpdated)
                                .buildDelete(this.algorithmService.algorithmDeleted);
                            handler.skip(1);

                            if (handler.has(0)) {
                                if (handler.get(0) === 'test') {
                                    builder = new CreateTestReportTabBuilder(+handler.get(1), handler.get(2), builder as AlgorithmTabBuilder);
                                    builder.buildPrefix(`Test for `)
                                        .buildUpdate(this.testReportSessionService.sessionUpdated)
                                        .buildDelete(this.testReportSessionService.sessionDeleted)
                                        .buildFinish(this.testReportSessionService.sessionFinished)
                                        .buildClose(this.testReportSessionService.attemptDelete);
                                    handler.skip(3);
                                } else if (handler.get(0) === 'visualize') {
                                    builder = new VisualizeAlgorithmTabBuilder(+handler.get(1), handler.get(2), builder as AlgorithmTabBuilder);
                                    builder.buildPrefix(`Visual for `)
                                        .buildUpdate(this.algorithmVisualSessionService.sessionUpdated)
                                        .buildDelete(this.algorithmVisualSessionService.sessionDeleted)
                                        .buildFinish(this.algorithmVisualSessionService.sessionFinished)
                                        .buildClose(this.algorithmVisualSessionService.attemptDelete);
                                    handler.skip(3);
                                }
                            }
                        }
                    }
                } else if (handler.get(0) === 'visual') {
                    builder.buildRoute('visual');
                    handler.skip(1);   
                }

            }



            if (handler.done()) {
                return builder.build();
            }
        }
        throw handler.invalidRoute();
    }
}
