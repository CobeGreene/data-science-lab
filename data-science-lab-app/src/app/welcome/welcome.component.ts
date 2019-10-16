import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import * as PluginsEvents from '../../../shared/events/plugins-events';
import { IpService } from '../../../shared/services/ip.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  text: string;

  constructor(private ipService: IpService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.text = 'nothing';
    console.log('start up');
    this.ipService.once(PluginsEvents.GetAllListeners, this.getAll);
    this.ipService.send(PluginsEvents.GetAllEvent);
    

  }

  getAll = (event, arg): void => {
    this.text = 'hello world';
    console.log('happen');
    this.ref.detectChanges();
  }

}
