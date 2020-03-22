import { Component, OnInit, Input } from '@angular/core';
import { Package } from '../../../../../../shared/models';
import { OpenLinkService } from '../../../../services/open-link-service/open-link.service';
import { PackageService } from '../../../../services/package-service';

@Component({
  selector: 'app-package-details-actions',
  templateUrl: './package-details-actions.component.html'
})
export class PackageDetailsActionsComponent implements OnInit {

  @Input() pluginPackage: Package;

  constructor(
    private packageService: PackageService,
    private openLinkService: OpenLinkService
  ) { }

  ngOnInit() {
  }

  onInstall() {
    this.packageService.install(this.pluginPackage);
  }
  
  onUninstall() {
    this.packageService.uninstall(this.pluginPackage);
  }

  onView() {
    this.openLinkService.open(`https://www.github.com/${this.pluginPackage.owner}/${this.pluginPackage.repositoryName}`);
  }

  onReport() {
    this.openLinkService.open(`https://www.github.com/${this.pluginPackage.owner}/${this.pluginPackage.repositoryName}/issues/new`);
  }

}
