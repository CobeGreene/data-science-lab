import { Component, OnInit, Input } from '@angular/core';
import { Package } from '../../../../../../shared/models';
import { TabService } from '../../../../services/tab-service';
import { RouterService } from '../../../../services/router-service';
import { TabFactory } from '../../../../factory/tab-factory';

@Component({
  selector: 'app-package-explorer-card',
  templateUrl: './package-explorer-card.component.html',
  styleUrls: ['./package-explorer-card.component.css']
})
export class PackageExplorerCardComponent implements OnInit {

  @Input() pluginPackage: Package;

  constructor(
    private routerService: RouterService,
    private tabService: TabService,
    private tabFactory: TabFactory
  ) { }

  ngOnInit() {
  }

  onClick() {
    const tab = this.tabFactory.create(['package', this.pluginPackage.name]);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }

}
