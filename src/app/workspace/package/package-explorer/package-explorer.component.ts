import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../services/package-service';
import { Package } from '../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { PluginTypes } from 'data-science-lab-core';

@Component({
  selector: 'app-package-explorer',
  templateUrl: './package-explorer.component.html',
  styleUrls: ['./package-explorer.component.css']
})
export class PackageExplorerComponent implements OnInit, OnDestroy {

  packages: Package[];

  search: string;
  type: string;
  isSearching: boolean;

  constructor(private packageService: PackageService) { }

  ngOnInit() {

    this.packageService.featureChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.packages = value;
        this.isSearching = false;
      });

    this.packages = this.packageService.featurePackages();
    this.type = 'All';
    this.isSearching = false;
  }

  ngOnDestroy() {

  }

  types(): string[] {
    return ['All', ...Object.keys(PluginTypes)];
  }

  onTypeChange(type: string) {
    this.type = type;
  }

  onSearch() {
    this.isSearching = true;
    this.packageService.search(this.search, this.type, 0);
  }

}
