import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { CheckboxOption } from 'data-science-lab-core';


@Component({
  selector: 'app-checkbox-option',
  templateUrl: './checkbox-option.component.html',
  styleUrls: ['./checkbox-option.component.css']
})
export class CheckboxOptionComponent implements OnInit, AfterViewInit {

  @Input() option: CheckboxOption;

  @Output() emitChange = new EventEmitter<{ valid: boolean, value: any }>();

  @Input() value: boolean;

  constructor() { }

  ngOnInit() {
    if (this.value === undefined) {
      this.value = false;
    }
  }

  onChange(event: boolean) {
    this.value = event;
    this.emitChange.emit({ valid: true, value: this.value });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emitChange.emit({ valid: true, value: this.value  });
    });
  }


}
