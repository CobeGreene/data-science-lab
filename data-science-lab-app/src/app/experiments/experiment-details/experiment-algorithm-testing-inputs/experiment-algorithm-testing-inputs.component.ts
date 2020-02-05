import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataGroupViewModel, TestingSessionViewModel, PluginInputViewModel } from '../../../../../shared/view-models';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { AlgorithmTestingSessionService, DataGroupsService } from '../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-algorithm-testing-inputs',
    templateUrl: './experiment-algorithm-testing-inputs.component.html',
    styleUrls: [] 
})
export class ExperimentAlgorithmTestingInputsComponent implements OnInit, OnDestroy {
    
    experimentId: number;
    id: number;
    dataGroup: DataGroupViewModel;
    session: TestingSessionViewModel;
    inputs: PluginInputViewModel[];
    

    constructor(private route: ActivatedRoute,
                private router: Router,
                private sessionService: AlgorithmTestingSessionService,
                private dataGroupService: DataGroupsService) {

    }
    
    ngOnInit(): void {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });

        this.route.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.algorithmId;
                this.session = this.sessionService.get(this.id);
                this.dataGroup = this.dataGroupService.get(this.session.dataGroupId);
                this.inputs = this.session.inputs.concat(this.session.output);
            });

        this.sessionService.testingSessionFinish
            .pipe(untilComponentDestroyed(this))
            .subscribe((value) => {
                if (value === this.id) {
                    this.router.navigate(['experiment', 'details', this.experimentId, 'algorithm', this.id]);
                }
            });
    }    
    
    
    ngOnDestroy(): void {
    }

    onSubmit(inputs: {[id: string]: number[]}) {
        const input: {[id: string]: number[]} = {};
        const output: {[id: string]: number[]} = {};

        this.session.inputs.forEach((value) => {
            input[value.id] = inputs[value.id];
        });

        this.session.output.forEach((value) => {
            output[value.id] = inputs[value.id];
        });
        this.sessionService.startTest(this.id, input, output);
    }


}





