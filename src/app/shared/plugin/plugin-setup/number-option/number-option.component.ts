import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { NumberOption } from 'data-science-lab-core';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-number-option',
  templateUrl: './number-option.component.html',
})
export class NumberOptionComponent implements OnInit, AfterViewInit {

  
  @Input() option: NumberOption;

  @Input() submitted: boolean;

  @Output() emitChange = new EventEmitter<{ valid: boolean, value: any }>();

  @ViewChild('number', { static: false }) numberComponent: NgModel;

  @Input() value: number;

  constructor() { }

  ngOnInit() {
  }

  onChange(_: Event) {
    this.emitChange.emit({
      valid: this.isValid(this.value),
      value: this.value
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emitChange.emit({
        valid: this.isValid(this.value),
        value: this.value
      });
    });
  }

  isValid(num: number) {
    if (this.option.min && num < this.option.min) {
      return false;
    }
    if (this.option.max && num > this.option.max) {
      return false;
    }
    return this.isInteger(num);
  }

  isInteger(num: number) {
    if (num === undefined) {
      return false;
    }
    return Number.isInteger(num);
  }

}
