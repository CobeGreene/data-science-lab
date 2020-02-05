import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PluginInputViewModel, DataGroupViewModel } from '../../../../../shared/view-models';

@Component({
    selector: 'app-experiment-inputs',
    templateUrl: './experiment-inputs.component.html',
    styleUrls: []
})
export class ExperimentInputsComponent implements OnInit, OnDestroy {

    private __inputList: PluginInputViewModel[];
    private indices: {[id: string]: number[]};
    private valid: boolean;

    @Input() set inputList(inputList: PluginInputViewModel[]) {
        this.__inputList = inputList;
        this.indices = {};
        inputList.forEach((value) => {
            this.indices[value.id] = [];
        });
        this.valid = this.isValid();
    }

    get inputList(): PluginInputViewModel[] {
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
        this.emitSubmit.emit(this.indices);
    }

    onChange(featureIndex: number, id: string) {
        for (const key in this.indices) {
            if (this.indices[key]) {
                for (let i = 0; i < this.indices[key].length; ++i) {
                    if (this.indices[key][i] === featureIndex) {
                        this.indices[key].splice(i, 1);
                        break;
                    }
                }
            }
        }
        if (this.indices[id]) {
            this.indices[id].push(featureIndex);
        }
        this.valid = this.isValid();
    }

    isValid(): boolean {
        for (const input of this.inputList) {
            const length = this.indices[input.id].length;
            if (length < input.min) {
                return false;
            }
            if (input.max && length > input.max) {
                return false;
            } 
        }
        return true;

    }
}

