import { Component, Input, EventEmitter, Output } from '@angular/core';
import { NumberOption } from '../../../../../../shared/models';


@Component({
    selector: 'app-experiment-number-option',
    templateUrl: './experiment-number-option.component.html',
    styleUrls: []
})
export class ExperimentNumberOptionComponent {
    @Input() option: NumberOption;
    @Input() id: number;

    @Output() validChange: EventEmitter<{ id: number, valid: boolean, value: any }> =
        new EventEmitter<{ id: number, valid: boolean, value: any }>();

    value: number;

    onNumberChange(newValue: number) {
        this.value = newValue;
        this.validChange.emit({ id: this.id, valid: true, value: this.value  });
    }
}
