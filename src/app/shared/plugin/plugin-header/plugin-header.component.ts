import { Component, OnInit, Output, EventEmitter, HostBinding, OnDestroy } from '@angular/core';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-plugin-header',
  templateUrl: './plugin-header.component.html',
  styleUrls: ['./plugin-header.component.css']
})
export class PluginHeaderComponent implements OnInit, OnDestroy {

  @Output() emitReturn = new EventEmitter<void>();
  @Output() emitExit = new EventEmitter<void>();

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

  onReturn() {
    this.emitReturn.emit();
  }

  onExit() {
    this.emitExit.emit();
  }

}
