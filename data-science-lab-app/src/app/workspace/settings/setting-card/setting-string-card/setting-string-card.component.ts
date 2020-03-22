import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Setting } from '../../../../../../shared/models';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'app-setting-string-card',
  templateUrl: './setting-string-card.component.html'
})
export class SettingStringCardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() setting: Setting;

  @Output() emitChange: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('stringCmp', { static: false }) stringComponent: ElementRef;

  private sub: Subscription;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    if (this.stringComponent) {
      this.sub = fromEvent<Event>(this.stringComponent.nativeElement, 'input')
        .pipe(
          map((event: Event) => (event.target as HTMLInputElement).value),
          debounceTime(1000),
          distinctUntilChanged()
        ).subscribe(() => {
          if (this.isValid(this.setting.value)) {
            this.emitChange.emit(this.setting.value);
          }
        });

    }
  }

  onChange(value: string) {
    this.emitChange.emit(value);
  }

  isValid(value: string) {
    if (this.setting.min && value.length < this.setting.min) {
      return false;
    }
    if (this.setting.max && value.length > this.setting.max) {
      return false;
    }
    return true;
  }


}
