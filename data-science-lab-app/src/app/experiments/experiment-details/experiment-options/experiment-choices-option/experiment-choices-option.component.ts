import { Component, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ChoicesOption } from '../../../../../../shared/models';


@Component({
    selector: 'app-experiment-choices-option',
    templateUrl: './experiment-choices-option.component.html',
    styleUrls: []
})
export class ExperimentChoicesOptionComponent implements AfterViewInit, OnInit {
    @Input() option: ChoicesOption;
    @Input() id: number;

    @Output() validChange: EventEmitter<{ id: number, valid: boolean, value: any }> =
        new EventEmitter<{ id: number, valid: boolean, value: any }>();

    value: string;

    onCheckChange(newValue: string) {
        this.value = newValue;
        this.validChange.emit({ id: this.id, valid: true, value: this.value  });
    }

    ngOnInit() {
        this.value = this.option.choices[0];
    }
    
    ngAfterViewInit() {
        this.validChange.emit({ id: this.id, valid: true, value: this.value  });
    }  
}
