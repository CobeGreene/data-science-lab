import { Component, OnInit, OnDestroy } from '@angular/core';
import { PluginService } from '../services/plugin-services/plugin.service';
import { Plugin } from '../../../shared/models/plugin';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: []
})
export class PluginsComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }


}
