import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TextOption } from 'data-science-lab-core';
import { NgModel } from '@angular/forms';
import { isValidText } from '../plugin-options.helper';

@Component({
  selector: 'app-text-option',
  templateUrl: './text-option.component.html',
})
export class TextOptionComponent implements OnInit, AfterViewInit {

  @Input() option: TextOption;

  @Input() submitted: boolean;

  @Output() emitChange = new EventEmitter<{ valid: boolean, value: any }>();

  @ViewChild('text', { static: false }) textComponent: NgModel;

  @Input() value: string;

  constructor() { }

  ngOnInit() {

  }

  isValid(): boolean {
    return isValidText(this.value, this.option);
  }

  onChange(_) {
    this.emitChange.emit({
      valid: this.isValid(),
      value: this.value
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emitChange.emit({
        valid: this.isValid(),
        value: this.value
      });
    });
  }

}
