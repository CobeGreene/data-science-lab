import { Component, OnInit } from '@angular/core';
import { TabFactory } from '../../../../../factory/tab-factory';
import { TabService } from '../../../../../services/tab-service';

@Component({
  selector: 'app-sidebar-package-explorer',
  templateUrl: './sidebar-package-explorer.component.html',
  styleUrls: ['./sidebar-package-explorer.component.css']
})
export class SidebarPackageExplorerComponent implements OnInit {

  constructor(
    private tabFactory: TabFactory,
    private tabService: TabService
  ) { }

  ngOnInit() {
  }

  onExplore(_: MouseEvent) {
    this.tabFactory.create(['package']);
    this.tabService.openTab(this.tabFactory.create(['package']));
  }

}
