import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { OptionList, OptionTypes, TextOption } from '../../../../../shared/models';
import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-experiment-options',
    templateUrl: './experiment-options.component.html',
    styleUrls: []
})
export class ExperimentOptionsComponent implements OnInit, OnDestroy {

    @ViewChild('f', { static: false }) experimentOptionForm: NgForm;

    @Input() optionList: OptionList; 
    @Output() emitSubmit: EventEmitter<{[id: string]: any}> = new EventEmitter<{[id: string]: any}>();

    public optionType = OptionTypes;
    public validInputs: boolean[] = [];
    public valueInputs: any[] = [];
    public valid: boolean;

    ngOnInit() {
        this.optionList.options.forEach(() => {
            this.validInputs.push(false);
            this.valueInputs.push(null);
        });
        this.valid = this.validInputs.length === 0;
    }

    ngOnDestroy() {

    }

    onValidChange(event: {id: number, valid: boolean, value: any}) {
        this.validInputs[event.id] = event.valid;
        this.valueInputs[event.id] = event.value;
        const find = this.validInputs.findIndex((v) => {
            return !v;
        });
        this.valid = find < 0;
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        console.log(value);
        throw new Error('Not implemented. On submit');
    }

}