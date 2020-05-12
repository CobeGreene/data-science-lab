import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-plugin-body',
  templateUrl: './plugin-body.component.html',
  styleUrls: ['./plugin-body.component.css']
})
export class PluginBodyComponent implements OnInit, OnDestroy {

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;


  constructor(private coreAreaService: CoreAreaService) { }

  ngOnInit() {
    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });
    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();
  }

  ngOnDestroy() {

  }

}
