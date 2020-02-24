import { Component, OnInit, ViewChildren, ElementRef, QueryList, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
import { Package } from '../../../../../../shared/models';
import { FocusService } from '../../../../services/focus-service';
import { SidebarService } from '../../../../services/sidebar-service';
import { TabFactory } from '../../../../factory/tab-factory';
import { TabService } from '../../../../services/tab-service';
import { FocusAreas } from '../../../../constants';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { PackageService } from '../../../../services/package-service';
import { ShortcutService } from '../../../../services/shortcut-service';

interface SidebarPackageData {
  installSelected: number;
  inFocus?: boolean;
}

@Component({
  selector: 'app-sidebar-package',
  templateUrl: './sidebar-package.component.html',
  styleUrls: ['./sidebar-package.component.css']
})
export class SidebarPackageComponent implements OnInit, OnDestroy, AfterViewInit {

  data: SidebarPackageData;

  installPackages: Package[];

  @ViewChildren('packageCmp', { read: ElementRef }) packageComponents: QueryList<ElementRef<HTMLElement>>;

  constructor(
    private focusService: FocusService,
    private sidebarService: SidebarService,
    private shortcutService: ShortcutService,
    private tabFactory: TabFactory,
    private tabService: TabService,
    private packageService: PackageService
  ) { }

  @HostListener('click', ['$event']) onFocusSidebar(event: MouseEvent) {
    this.focusService.set(FocusAreas.Sidebar);
    event.stopPropagation();
  }

  ngOnInit() {
    this.data = this.sidebarService.get<SidebarPackageData>('sidebar-package-data', {
      installSelected: 0,
    });

    this.focusService.focusChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.data.inFocus = value === FocusAreas.Sidebar;
      });

    this.data.inFocus = this.focusService.current() === FocusAreas.Sidebar;

    this.packageService.packagesChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((_) => {
        this.initializePackages();
      });

    this.initializePackages();
  }

  initializePackages() {
    const packages = this.packageService.all();
    this.installPackages = packages.filter((value) => value.install);
  }

  ngAfterViewInit() {
    this.shortcutService.subscribe('arrowup', this.onMoveUp);
    this.shortcutService.subscribe('arrowdown', this.onMoveDown);
    this.shortcutService.subscribe('enter', this.onEnter);
  }

  ngOnDestroy() {
    this.shortcutService.unsubscribe('arrowup', this.onMoveUp);
    this.shortcutService.unsubscribe('arrowdown', this.onMoveDown);
    this.shortcutService.unsubscribe('enter', this.onEnter);
    this.sidebarService.set('sidebar-package-data', this.data);
  }


  onMoveUp = () => {
    if (this.data.inFocus) {
      if (this.data.installSelected > 0) {
        this.data.installSelected -= 1;
        this.scrollIntoViewInstalledSelected();
      }
    }
  }

  onMoveDown = () => {
    if (this.data.inFocus) {
      if (this.data.installSelected < this.installPackages.length - 1 && this.installPackages.length !== 0) {
        this.data.installSelected += 1;
        this.scrollIntoViewInstalledSelected();
      }
    }
  }


  onEnter = () => {
    if (this.data.inFocus) {
      this.onInstallSelected(this.data.installSelected);
    }
  }

  onInstallSelected(selected: number) {
    this.data.installSelected = selected;
    this.scrollIntoViewInstalledSelected();
  }


  scrollIntoViewInstalledSelected() {
    this.scrollIntoViewSelected(this.data.installSelected);
  }

  scrollIntoViewSelected(select: number) {
    const element = this.packageComponents.toArray()[select];
    if (element !== undefined) {
      (element.nativeElement).scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
    }
  }

}
