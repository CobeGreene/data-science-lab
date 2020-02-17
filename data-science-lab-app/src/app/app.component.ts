import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'data-science-lab-app';

  constructor(private zone: NgZone) {
    
  }

  ngOnInit() {
    window.electronIpcOn('listener', (event: string, msg: string) => {
      this.zone.run(() => {
        console.log('angular side');
        this.title = msg;
      });
    });

    window.electronIpcSend('event');
  }

}
