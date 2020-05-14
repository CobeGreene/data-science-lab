import { Component, OnInit, ViewChild } from '@angular/core';
import { DropdownComponent } from '../../../../shared/dropdown/dropdown.component';
import { OverlayService } from '../../../../services/overlay-service';
import { TabService } from '../../../../services/tab-service';
import { RouterService } from '../../../../services/router-service';

@Component({
  selector: 'app-tab-options',
  templateUrl: './tab-options.component.html',
  styleUrls: ['./tab-options.component.css']
})
export class TabOptionsComponent implements OnInit {

  constructor(
    private routerService: RouterService,
    private tabService: TabService,
    private overlayService: OverlayService
  ) { }

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;

  ngOnInit() {
  }

  onOpen(event: MouseEvent) {
    this.optionsComponent.open(event);
  }

  onCloseAll() {
    this.tabService.closeAll();
    this.closeDropdwon();
  }
  
  onKeepCurrent() {
    this.tabService.closeAll([this.routerService.current()]);
    this.closeDropdwon();
  }

  closeDropdwon() {
    this.overlayService.close();
    event.preventDefault();
    event.stopPropagation();
  }

}
