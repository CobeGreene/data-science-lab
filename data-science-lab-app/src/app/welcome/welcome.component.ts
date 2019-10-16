import { Component, OnInit } from '@angular/core';
import * as PluginsEvents from '../../../shared/events/plugins-events';
import { IpService } from '../../../shared/services/ip.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  text: string;

  constructor(private ipService: IpService) { }

  ngOnInit() {
    // this.text = 'nothing';
    // // this.ipService.once(PluginsEvents.GetAllListeners, (event, arg) => {
    // //   console.log(event);
    // //   console.log(arg);
    // //   this.text = 'hello world';
    // //   console.log(this.text);
    // // });
    // // this.ipService.send(PluginsEvents.GetAllEvent);
    // setTimeout(() => {
    //   this.text = 'hello world';
    // }, 5000);
    

  }

}
