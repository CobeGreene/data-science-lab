import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Setting } from '../../../../../../shared/models';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

@Component({
  selector: 'app-setting-number-card',
  templateUrl: './setting-number-card.component.html'
})
export class SettingNumberCardComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() setting: Setting;

  @Output() emitChange: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('numberCmp', { static: false }) numberComponent: ElementRef;

  private sub: Subscription;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  ngAfterViewInit() {
    this.sub = fromEvent<Event>(this.numberComponent.nativeElement, 'input')
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

  isValid(num: number) {
    if (this.setting.min && num < this.setting.min) {
      return false;
    }
    if (this.setting.max && num > this.setting.max) {
      return false;
    }
    return this.isInteger(num);
  }

  isInteger(num: number) {
    return Number.isInteger(num);
  }

}
