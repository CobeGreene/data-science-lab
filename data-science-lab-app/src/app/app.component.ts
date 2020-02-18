import { Component, OnInit, NgZone } from '@angular/core';
import { ThemeService } from './services/theme-service/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'data-science-lab-app';

  constructor(private themeService: ThemeService) {
  }

  ngOnInit() {
  }

}
