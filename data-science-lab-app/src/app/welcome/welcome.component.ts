import { Component, OnInit } from '@angular/core';
import * as PluginsEvents from '../../../shared/events/plugins-events';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  text: string;

  constructor() { }

  ngOnInit() {
    window.electronIpcOnce(PluginsEvents.GetAllListeners, (event, arg) => {
      console.log(arg);
      this.text = arg[0];
    });
    window.electronIpcSend(PluginsEvents.GetAllEvent);

  }

}
