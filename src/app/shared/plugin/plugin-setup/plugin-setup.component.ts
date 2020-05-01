import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Plugin } from '../../../../../shared/models';
import { OptionTypes, Option } from 'data-science-lab-core';


@Component({
  selector: 'app-plugin-setup',
  templateUrl: './plugin-setup.component.html'
})
export class PluginSetupComponent implements OnInit {
  @Output() emitSubmit = new EventEmitter<{ [id: string]: any }>();

  @Output() emitCommand = new EventEmitter<string>();

  @Output() emitValues = new EventEmitter<{ [id: string]: any }>();

  @Output() emitReturn = new EventEmitter<void>();

  @Output() emitQuit = new EventEmitter<void>();

  private _optionList: Option[];

  @Input() set optionList(optionList: Option[]) {
    this._optionList = optionList;
    this.validInputs = [];
    this.valueInputs = [];
    this.submitted = false;
    this.isWaiting = false;
    this.optionList.forEach(() => {
      this.validInputs.push(false);
      this.valueInputs.push(null);
    });
    this.valid = this.validInputs.length === 0;
  }

  get optionList(): Option[] {
    return this._optionList;
  }

  @Input() plugin: Plugin;

  @Input() values: { [id: string]: any } = {};

  optionTypes = OptionTypes;
  public validInputs: boolean[] = [];
  public valueInputs: any[] = [];
  public valid: boolean;
  public submitted: boolean;
  @Input() public isWaiting: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onOptionChange(index: number, event: { valid: boolean, value: any }) {
    this.validInputs[index] = event.valid;
    this.valueInputs[index] = event.value;
    this.values[this.optionList[index].id] = event.value;
    const find = this.validInputs.findIndex((v) => {
      return !v;
    });
    this.valid = find < 0;
    this.emitValues.emit(this.values);
  }

  onCommand(cmd: string) {
    if (!this.isWaiting) {
      this.isWaiting = true;
      this.emitCommand.emit(cmd);
    }
  }

  onSubmit() {
    if (this.valid && !this.isWaiting) {
      this.isWaiting = true;
      this.emitSubmit.emit(this.values);
    } else {
      this.submitted = true;
    }

  }

  onReturn() {
    this.emitReturn.emit();
  }

  onExit() {
    this.emitQuit.emit();
  }



}
