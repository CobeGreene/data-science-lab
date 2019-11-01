import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommandOption } from '../../../../../../shared/models';
import { ExperimentSetupInputService } from '../../../../services';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-command-option',
    templateUrl: './experiment-command-option.component.html',
    styleUrls: []
})
export class ExperimentCommandOptionComponent implements OnInit, OnDestroy {


    @Input() option: CommandOption;
    @Input() id: number;

    @Output() validChange: EventEmitter<{ id: number, valid: boolean, value: any }> =
        new EventEmitter<{ id: number, valid: boolean, value: any }>();

    private experimentId: number;


    constructor(private experimentService: ExperimentSetupInputService, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.experimentId = +params.id;
            });

    }

    ngOnDestroy() {

    }


    onCommandClick() {
        this.experimentService.executeCommand(this.experimentId, this.option.command);
    }

}
