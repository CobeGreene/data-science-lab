import { Component, OnInit, Input } from '@angular/core';
import { Package } from '../../../../../../../shared/models';

@Component({
  selector: 'app-sidebar-package-card',
  templateUrl: './sidebar-package-card.component.html',
  styleUrls: ['./sidebar-package-card.component.css']
})
export class SidebarPackageCardComponent implements OnInit {

  @Input() pluginPackage: Package;

  constructor() { }

  ngOnInit() {
  }

}
