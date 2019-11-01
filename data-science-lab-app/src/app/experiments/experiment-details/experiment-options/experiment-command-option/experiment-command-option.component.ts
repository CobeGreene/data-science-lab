import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommandOption } from '../../../../../../shared/models';


@Component({
    selector: 'app-experiment-command-option',
    templateUrl: './experiment-command-option.component.html',
    styleUrls: []
})
export class ExperimentCommandOptionComponent {
    @Input() option: CommandOption;
    @Input() id: number;

    @Output() validChange: EventEmitter<{ id: number, valid: boolean, value: any }> =
        new EventEmitter<{ id: number, valid: boolean, value: any }>();

    onCommandClick() {
        throw new Error('Not implemented');
    }

}
