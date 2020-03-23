import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackageService } from '../../../services/package-service';
import { Package } from '../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.css']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {

  pluginPackage: Package;

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.packageService.packagesChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        const name = this.route.snapshot.paramMap.get('name');
        this.pluginPackage = this.packageService.get(name);
      });

    const packageName = this.route.snapshot.paramMap.get('name');
    this.pluginPackage = this.packageService.get(packageName);
  }

  ngOnDestroy() {
    
  }

}