import { Component, OnInit, Input } from '@angular/core';
import { Package } from '../../../../../../shared/models';

@Component({
  selector: 'app-package-explorer-card',
  templateUrl: './package-explorer-card.component.html',
  styleUrls: ['./package-explorer-card.component.css']
})
export class PackageExplorerCardComponent implements OnInit {

  @Input() pluginPackage: Package;

  constructor() { }

  ngOnInit() {
  }

}
