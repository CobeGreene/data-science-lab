import { Component, OnInit, OnDestroy } from '@angular/core';
import { Setting } from '../../../../shared/models';
import { UserSettingService } from '../../services/user-setting-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

  settings: Setting[];

  constructor(private settingService: UserSettingService) {

  }

  ngOnInit() {
    this.settingService.settingsChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.settings = this.settingService.all();
      });

    this.settings = this.settingService.all();
  }

  ngOnDestroy() {

  }

}
