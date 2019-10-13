import { Component, OnInit } from '@angular/core';
import { PluginService } from '../services/plugin_services/plugin.service';
import { Plugin } from '../../../shared/models/plugin';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.css']
})
export class PluginsComponent implements OnInit {

  plugins: Plugin[];

  constructor(private pluginService: PluginService) { }

  ngOnInit() {
    this.pluginService.all().then((value: Plugin[]) => {
      this.plugins = value;
    });
  }

}
