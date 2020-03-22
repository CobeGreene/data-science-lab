import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Setting } from '../../../../../shared/models';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { UserSettingService } from '../../../services/user-setting-service';

@Component({
  selector: 'app-setting-card',
  templateUrl: './setting-card.component.html',
  styleUrls: ['./setting-card.component.css']
})
export class SettingCardComponent implements OnInit {

  @Input() setting: Setting;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;
  @ViewChild('gearCmp', { static: false }) gearComponent: ElementRef;

  constructor(private settingService: UserSettingService) { }

  ngOnInit() {
  }

  type() {
    return typeof(this.setting.default);
  }

  onChange(value: any) {
    this.setting.value = value;
    this.settingService.update(this.setting);
  }

  onOptions(event: MouseEvent) {
    this.optionsComponent.open(event, this.gearComponent);
  }

  onReset() {
    this.optionsComponent.close();
    this.setting.value = this.setting.default;
    this.settingService.update(this.setting);
  }

}
