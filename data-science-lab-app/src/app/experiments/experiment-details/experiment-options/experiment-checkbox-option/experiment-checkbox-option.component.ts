import { Component, AfterViewInit, Input, Output, EventEmitter,  } from '@angular/core';
import { CheckboxOption } from '../../../../../../shared/models';

@Component({
    selector: 'app-experiment-checkbox-option',
    templateUrl: './experiment-checkbox-option.component.html',
    styleUrls: []
})
export class ExperimentCheckboxOptionComponent implements AfterViewInit {

    @Input() option: CheckboxOption;
    @Input() id: number;

    @Output() validChange: EventEmitter<{ id: number, valid: boolean, value: any }> =
        new EventEmitter<{ id: number, valid: boolean, value: any }>();

    value = false;

    onCheckChange(newValue: boolean) {
        this.value = newValue;
        this.validChange.emit({ id: this.id, valid: true, value: this.value  });
    }
    
    ngAfterViewInit() {
        this.validChange.emit({ id: this.id, valid: true, value: this.value  });
    }

}
