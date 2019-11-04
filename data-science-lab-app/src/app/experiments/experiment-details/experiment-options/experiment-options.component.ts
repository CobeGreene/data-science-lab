import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { OptionList, OptionTypes } from 'data-science-lab-core';
import { NgForm } from '@angular/forms';
import { ExperimentSetupInputService } from '../../../services';
import { ActivatedRoute, Params } from '@angular/router';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
    selector: 'app-experiment-options',
    templateUrl: './experiment-options.component.html',
    styleUrls: []
})
export class ExperimentOptionsComponent implements OnInit, OnDestroy {

    @ViewChild('f', { static: false }) experimentOptionForm: NgForm;

    @Input() optionList: OptionList;
    @Output() emitSubmit: EventEmitter<{ [id: string]: any }> = new EventEmitter<{ [id: string]: any }>();

    public optionType = OptionTypes;
    public validInputs: boolean[] = [];
    public valueInputs: any[] = [];
    public valid: boolean;
    public id: number;

    constructor(private experimentSetupInputService: ExperimentSetupInputService, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.parent.params
            .pipe(untilComponentDestroyed(this))
            .subscribe((params: Params) => {
                this.id = +params.id;
            });

        this.optionList.options.forEach(() => {
            this.validInputs.push(false);
            this.valueInputs.push(null);
        });
        this.valid = this.validInputs.length === 0;
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

    onSubmit(form: NgForm) {
        const value = form.value;
        const inputs: {[id: string]: any} = {};
        for (let i = 0; i < this.optionList.options.length; ++i) {
            inputs[this.optionList.options[i].id] = this.valueInputs[i];
        }   
        this.experimentSetupInputService.submit(this.id, inputs);
    }

}
