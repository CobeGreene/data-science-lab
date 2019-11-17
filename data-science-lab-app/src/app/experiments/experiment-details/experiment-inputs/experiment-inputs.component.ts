import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { SelectTransformPluginInput } from '../../../../../shared/models';
import { DataGroupViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-inputs',
    templateUrl: './experiment-inputs.component.html',
    styleUrls: []
})
export class ExperimentInputsComponent implements OnInit, OnDestroy {

    private __inputList: SelectTransformPluginInput[];
    private indices: {[id: string]: number[]};
    private valid: boolean;

    @Input() set inputList(inputList: SelectTransformPluginInput[]) {
        this.__inputList = inputList;
        this.indices = {};
        inputList.forEach((value) => {
            this.indices[value.id] = [];
        });
        this.valid = this.isValid();
        this.__inputList[0].id
    }

    get inputList(): SelectTransformPluginInput[] {
        return this.__inputList;
    }

    @Input() dataGroup: DataGroupViewModel;

    @Output() emitSubmit: EventEmitter<{[id: string]: number[]}> = new EventEmitter<{[id: string]: number[]}>();

    constructor() {

    }

    ngOnInit() {

    }

    ngOnDestroy() {

    }

    onSubmit() {

    }

    isValid(): boolean {
        return false;
    }
}

