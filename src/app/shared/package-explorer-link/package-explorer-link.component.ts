import { Component, OnInit } from '@angular/core';
import { TabFactory } from '../../factory/tab-factory';
import { TabService } from '../../services/tab-service';


@Component({
  selector: 'app-package-explorer-link',
  templateUrl: './package-explorer-link.component.html',
  styleUrls: ['./package-explorer-link.component.css']
})
export class PackageExplorerLinkComponent implements OnInit {

  constructor(
    private tabFactory: TabFactory,
    private tabService: TabService
  ) { }

  ngOnInit() {
  }

  onClick() {
    const tab = this.tabFactory.create(['package']);
    this.tabService.openTab(tab);
  }

}
