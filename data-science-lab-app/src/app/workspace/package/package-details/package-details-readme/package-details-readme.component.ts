import { Component, OnInit, Input } from '@angular/core';
import { Package } from '../../../../../../shared/models';

@Component({
  selector: 'app-package-details-readme',
  templateUrl: './package-details-readme.component.html',
  styleUrls: ['./package-details-readme.component.css']
})
export class PackageDetailsReadmeComponent implements OnInit {

  @Input() pluginPackage: Package;

  constructor() { }

  ngOnInit() {
  }

}
