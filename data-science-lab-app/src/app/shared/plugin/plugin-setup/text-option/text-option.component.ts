import { Component, OnInit, AfterViewInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TextOption } from 'data-science-lab-core';
import { NgModel } from '@angular/forms';

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

  onChange(_) {
    this.emitChange.emit({
      valid: this.textComponent.valid,
      value: this.value
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emitChange.emit({
        valid: this.textComponent.valid,
        value: this.value
      });
    });
  }

}
