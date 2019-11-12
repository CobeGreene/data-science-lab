import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommandOption } from 'data-science-lab-core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
    selector: 'app-experiment-command-option',
    templateUrl: './experiment-command-option.component.html',
    styleUrls: []
})
export class ExperimentCommandOptionComponent implements OnInit, OnDestroy {


    @Input() option: CommandOption;
    @Input() id: number;

    @Output() executeCommand: EventEmitter<string> =
        new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {

    }

    onCommandClick() {
        this.executeCommand.emit(this.option.command);
    }

}
