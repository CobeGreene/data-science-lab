import { Component, OnInit, Input } from '@angular/core';
import { Tab } from '../../../../models';
import { TabService } from '../../../../services/tab-service';

@Component({
  selector: 'app-tab-card',
  templateUrl: './tab-card.component.html',
  styleUrls: ['./tab-card.component.css']
})
export class TabCardComponent implements OnInit {

  @Input() tab: Tab;

  constructor(private tabService: TabService) { }

  ngOnInit() {
  }

  onClose(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.tabService.removeTab(this.tab.route);
  }

}
