import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterService } from '../../../../services/router-service';
import { FetchSessionService } from '../../../../session-services/fetch-session-service';
import { PackageService } from '../../../../services/package-service';
import { Plugin, Session } from '../../../../../../shared/models';
import { PluginTypes } from 'data-science-lab-core';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-dataset-select-fetch',
  templateUrl: './dataset-select-fetch.component.html'
})
export class DatasetSelectFetchComponent implements OnInit, OnDestroy {

  plugins: Plugin[];
  session: Session;

  constructor(
    private routerService: RouterService,
    private fetchSessionService: FetchSessionService,
    private packageService: PackageService,
  ) { }

  ngOnInit() {
    const id = this.routerService.data().sessionId;
    this.session = this.fetchSessionService.get(id);

    this.packageService.packagesChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe(() => {
        this.initPlugins();
      });

    this.initPlugins();
  }

  ngOnDestroy() {
    
  }

  onExit() {
    this.fetchSessionService.delete(this.session.id);
  }

  onReturn() {
    this.fetchSessionService.previous(this.session.id);
  }

  onPlugin(plugin: Plugin) {
    this.fetchSessionService.select(this.session.id, plugin);
  }

  initPlugins() {
    this.plugins = (([] as Plugin[]).concat(...this.packageService.all().filter(value => value.install).map(value => value.plugins)))
      .filter(value => value.type === PluginTypes.Fetch);
  }

}
