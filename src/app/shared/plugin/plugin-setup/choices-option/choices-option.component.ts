import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ChoicesOption } from 'data-science-lab-core';


@Component({
  selector: 'app-choices-option',
  templateUrl: './choices-option.component.html',
})
export class ChoicesOptionComponent implements OnInit, AfterViewInit {

  @Input() option: ChoicesOption;

  @Output() emitChange = new EventEmitter<{ valid: boolean, value: any }>();

  @Input() value: string;

  constructor() { }

  ngOnInit() {
    if (this.value === undefined) {
      this.value = this.option.choices[0];
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.emitChange.emit({ valid: true, value: this.value  });
    });
  }
  
  onChange(event: string) {
    this.value = event;
    this.emitChange.emit({ valid: true, value: this.value  });
  }

}
