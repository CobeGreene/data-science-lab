import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { OptionList, OptionTypes } from 'data-science-lab-core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-options',
    templateUrl: './experiment-options.component.html',
    styleUrls: []
})
export class ExperimentOptionsComponent implements OnInit, OnDestroy {

    @ViewChild('f', { static: false }) experimentOptionForm: NgForm;

    private _optionList: OptionList;

    @Input() set optionList(optionList: OptionList) {
        this._optionList = optionList;
        this.validInputs = [];
        this.valueInputs = [];
        this.optionList.options.forEach(() => {
            this.validInputs.push(false);
            this.valueInputs.push(null);
        });
        this.valid = this.validInputs.length === 0;
        
    }

    get optionList(): OptionList {
        return this._optionList;
    }

    @Output() emitSubmit: EventEmitter<{ [id: string]: any }> = new EventEmitter<{ [id: string]: any }>();
    @Output() emitCommandExecute: EventEmitter<string> = new EventEmitter<string>();

    public optionType = OptionTypes;
    public validInputs: boolean[] = [];
    public valueInputs: any[] = [];
    public valid: boolean;

    constructor() {

    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    onValidChange(event: { id: number, valid: boolean, value: any }) {
        this.validInputs[event.id] = event.valid;
        this.valueInputs[event.id] = event.value;
        const find = this.validInputs.findIndex((v) => {
            return !v;
        });
        this.valid = find < 0;
    }

    onExecuteComamnd(cmd: string) {
        this.emitCommandExecute.emit(cmd);
    }

    onSubmit() {
        const inputs: { [id: string]: any } = {};
        for (let i = 0; i < this.optionList.options.length; ++i) {
            inputs[this.optionList.options[i].id] = this.valueInputs[i];
        }
        this.emitSubmit.emit(inputs);
    }

}
