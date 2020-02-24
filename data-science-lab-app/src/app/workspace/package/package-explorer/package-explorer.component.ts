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


  constructor(private packageService: PackageService) { }

  ngOnInit() {

    this.packageService.packagesChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.packages = value;
      });

    this.packages = this.packageService.all();
    this.type = 'All';
  }

  ngOnDestroy() {

  }

  types(): string[] {
    return ['All', ...Object.keys(PluginTypes)];
  }

}
