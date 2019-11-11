import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TextOption } from 'data-science-lab-core';


@Component({
    selector: 'app-experiment-text-option',
    templateUrl: './experiment-text-option.component.html',
    styleUrls: []
})
export class ExperimentTextOptionComponent {
    @Input() option: TextOption;
    @Input() id: number;

    @Output() validChange: EventEmitter<{ id: number, valid: boolean, value: any }> =
        new EventEmitter<{ id: number, valid: boolean, value: any }>();
        
    value: string;

    onTextChange(newValue: string) {
        this.value = newValue;
        this.validChange.emit({ id: this.id, valid: this.value.length !== 0, value: this.value });
    }
}
