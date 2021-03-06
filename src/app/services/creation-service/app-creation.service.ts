import { Injectable, OnDestroy } from '@angular/core';
import { CreationService } from './creation.service';
import { TabService } from '../tab-service';
import { TabFactory } from '../../factory/tab-factory';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ExperimentService } from '../experiment-service';
import { FetchSessionService } from '../../session-services/fetch-session-service';
import { DatasetService } from '../dataset-service';
import { AlgorithmService } from '../algorithm-service';
import { TransformSessionService } from '../../session-services/transform-session-service';
import { AlgorithmSessionService } from '../../session-services/algorithm-session-service';
import { TestReportSessionService } from '../../session-services/test-report-session-service';
import { DatasetVisualSessionService } from '../../session-services/dataset-visual-session-service';
import { AlgorithmVisualSessionService } from '../../session-services/algorithm-visual-session-service';
import { TestReportVisualSessionService } from '../../session-services/test-report-visual-session-service';
import { TestReportService } from '../test-report-service';
import { VisualizationService } from '../visualization-service/visualization.service';

@Injectable()
export class AppCreationService extends CreationService implements OnDestroy {

    constructor(
        private tabService: TabService,
        private tabFactory: TabFactory,
        private experimentService: ExperimentService,
        private datasetService: DatasetService,
        private algorithmService: AlgorithmService,
        private fetchSessionService: FetchSessionService,
        private transformSessionService: TransformSessionService,
        private algorithmSessionService: AlgorithmSessionService,
        private testReportSessionService: TestReportSessionService,
        private testReportService: TestReportService,
        private visualizationService: VisualizationService,
        private datasetVisualSessionService: DatasetVisualSessionService,
        private algorithmVisualSessionService: AlgorithmVisualSessionService,
        private testReportVisualSessionService: TestReportVisualSessionService) {
        super();
        this.subscribe();
    }

    subscribe() {
        this.experimentService.experimentCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment) => {
                const tab = this.tabFactory.create(['experiment', experiment.id]);
                this.tabService.openTab(tab);
            });

        this.visualizationService.visualCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((visual) => {
                this.visualizationService.show(visual.id);
            });

        this.experimentService.experimentLoaded
            .pipe(untilComponentDestroyed(this))
            .subscribe((experiment) => {
                const tab = this.tabFactory.create(['experiment', experiment.id]);
                this.tabService.openTab(tab);
            });

        this.fetchSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.fetchSessionService.get(id);
                const tab = this.tabFactory.create(['experiment', session.keyId, 'dataset', 'fetch', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });

        this.transformSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.transformSessionService.get(id);
                const experimentId = this.datasetService.get(session.keyId).experimentId;
                const tab = this.tabFactory.create(['experiment', experimentId, 'dataset', session.keyId, 'transform', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });

        this.datasetVisualSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.datasetVisualSessionService.get(id);
                const experimentId = this.datasetService.get(session.keyId).experimentId;
                const tab = this.tabFactory.create(['experiment', experimentId, 'dataset', session.keyId, 'visualize', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });

        this.algorithmVisualSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.algorithmVisualSessionService.get(id);
                const experimentId = this.algorithmService.get(session.keyId).experimentId;
                const tab = this.tabFactory.create(['experiment', experimentId, 'algorithm', session.keyId, 'visualize', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });

        this.testReportVisualSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.testReportVisualSessionService.get(id);
                const report = this.testReportService.get(session.keyId);
                const experimentId = this.algorithmService.get(report.algorithmId).experimentId;
                const tab = this.tabFactory.create(['experiment', experimentId, 'algorithm', report.algorithmId, 'test-report', report.id, 'visualize', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });


        this.testReportSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.testReportSessionService.get(id);
                const experimentId = this.algorithmService.get(session.algorithmId).experimentId;
                const tab = this.tabFactory.create(['experiment', experimentId, 'algorithm', session.algorithmId, 'test', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });

        this.algorithmSessionService.sessionCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((id) => {
                const session = this.algorithmSessionService.get(id);
                const experimentId = this.datasetService.get(session.keyId).experimentId;
                const tab = this.tabFactory.create(['experiment', experimentId, 'algorithm', 'create', id, session.state]);
                if (session.sessionOptions.newTab) {
                    this.tabService.openTab(tab);
                } else {
                    this.tabService.replaceTab(session.sessionOptions.currentRoute, tab);
                }
            });

        this.datasetService.datasetCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((dataset) => {
                const tab = this.tabFactory.create(['experiment', dataset.experimentId, 'dataset', dataset.id]);
                this.tabService.openTab(tab);
            });

        this.algorithmService.algorithmCreated
            .pipe(untilComponentDestroyed(this))
            .subscribe((algorithm) => {
                const tab = this.tabFactory.create(['experiment', algorithm.experimentId, 'algorithm', algorithm.id]);
                this.tabService.openTab(tab);
            });


    }

    ngOnDestroy() {

    }

}
