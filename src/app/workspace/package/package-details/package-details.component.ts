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

  name: string;
  pluginPackage: Package;

  constructor(
    private route: ActivatedRoute,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.name = this.route.snapshot.paramMap.get('name');
    
    this.packageService.packageGet
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.name === this.name) {
          this.pluginPackage = value;
        }
      });

    this.packageService.packagesChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.packageService.fetch(this.name);
      })

      
      this.route.params
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.getPluginPackage();
      });

      this.getPluginPackage();
  }

  ngOnDestroy() {

  }

  getPluginPackage() {
    const name = this.route.snapshot.paramMap.get('name');
    this.packageService.fetch(name);
  }

}
