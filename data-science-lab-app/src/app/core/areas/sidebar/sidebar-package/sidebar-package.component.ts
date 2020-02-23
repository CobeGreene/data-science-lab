import { Component, OnInit, ViewChildren, ElementRef, QueryList, HostListener, OnDestroy } from '@angular/core';
import { Package } from '../../../../../../shared/models';
import { FocusService } from '../../../../services/focus-service';
import { SidebarService } from '../../../../services/sidebar-service';
import { TabFactory } from '../../../../factory/tab-factory';
import { TabService } from '../../../../services/tab-service';
import { FocusAreas } from '../../../../constants';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

interface SidebarPackageData {
  installPackages: boolean;
  installSelected: number;
  availablePackages: boolean;
  availableSelected: number;
  selected: number;
  inFocus?: boolean;
}

@Component({
  selector: 'app-sidebar-package',
  templateUrl: './sidebar-package.component.html',
  styleUrls: ['./sidebar-package.component.css']
})
export class SidebarPackageComponent implements OnInit, OnDestroy {

  data: SidebarPackageData;

  installPackages: Package[];
  availablePackages: Package[];

  @ViewChildren('packageCmp', { read: ElementRef }) packageComponents: QueryList<ElementRef<HTMLElement>>;


  constructor(
    private focusService: FocusService,
    private sidebarService: SidebarService,
    private tabFactory: TabFactory,
    private tabService: TabService
  ) { }

  @HostListener('click', ['$event']) onFocusSidebar(event: MouseEvent) {
    this.focusService.set(FocusAreas.Sidebar);
    event.stopPropagation();
  }

  ngOnInit() {
    this.data = this.sidebarService.get<SidebarPackageData>('sidebar-package-data', {
      availablePackages: false,
      availableSelected: 0,
      installPackages: false,
      installSelected: 0,
      selected: 0
    }); 

    this.focusService.focusChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.data.inFocus = value === FocusAreas.Sidebar;
      });

    this.data.inFocus = this.focusService.current() === FocusAreas.Sidebar;

    
  }

  ngOnDestroy() {
    
  }

}
