import { Component, OnInit, Input } from '@angular/core';
import { TabService } from '../../../../services/tab-service';
import { RouterService } from '../../../../services/router-service';
import { TabFactory } from '../../../../factory/tab-factory';

@Component({
  selector: 'app-package-details-header',
  templateUrl: './package-details-header.component.html',
  styleUrls: ['./package-details-header.component.css']
})
export class PackageDetailsHeaderComponent implements OnInit {

  @Input() name: string;

  constructor(
    private routerService: RouterService,
    private tabService: TabService,
    private tabFactory: TabFactory
  ) { }

  ngOnInit() {
  }

  onReturn() {
    const tab = this.tabFactory.create(['package']);
    this.tabService.replaceTab(this.routerService.current(), tab);
  }

}
