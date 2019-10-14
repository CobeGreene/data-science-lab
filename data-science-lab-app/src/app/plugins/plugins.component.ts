import { Component, OnInit, OnDestroy } from '@angular/core';
import { PluginService } from '../services/plugin-services/plugin.service';
import { Plugin } from '../../../shared/models/plugin';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.css']
})
export class PluginsComponent implements OnInit, OnDestroy {

  plugins: Plugin[];

  constructor(private pluginService: PluginService) { }

  ngOnInit() {
    this.plugins = this.pluginService.all();
    this.pluginService.pluginsChanged.subscribe((value: Plugin[]) => {
      this.plugins = value;
    });
  }

  ngOnDestroy() {
    this.pluginService.pluginsChanged.unsubscribe();
  }

  getInstalledCount(): number {
    return this.plugins.filter((value: Plugin) => {
      return value.install;
    }).length;
  }

}
