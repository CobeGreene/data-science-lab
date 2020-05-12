import {
  Component, OnInit, AfterViewInit,
  OnDestroy, Input, Output, EventEmitter, ViewChildren, ElementRef, QueryList, HostBinding
} from '@angular/core';
import { PluginSelectionBox } from './plugin-selection-box';
import { Plugin } from '../../../../../../shared/models';
import { CoreAreaService } from '../../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-plugin-selection-list',
  templateUrl: './plugin-selection-list.component.html',
  styleUrls: ['./plugin-selection-list.component.css']
})
export class PluginSelectionListComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() plugins: Plugin[];

  boxes: PluginSelectionBox[];
  colors: string[];

  @Output() emitSelect = new EventEmitter<Plugin>();

  @ViewChildren('pluginCmp', { read: ElementRef }) pluginComponents: QueryList<ElementRef<HTMLElement>>;

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;


  constructor(private coreAreaService: CoreAreaService) {
    this.colors = [
      'plugin-accent1',
      'plugin-accent3',
      'plugin-accent4',
      'plugin-accent5',
      'plugin-accent6',
    ];
  }

  onSelect(event: Plugin) {
    this.emitSelect.emit(event);
  }

  ngOnInit() {
    this.boxes = [];

    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });
    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.buildPluginPackageBoxes();
    });
  }

  ngOnDestroy() {

  }

  onResized() {
    this.buildPluginPackageBoxes();
  }


  buildPluginPackageBoxes() {
    this.boxes = this.splitDisconnectedBoxes(this.getBoxes());
    let name = '';
    let travel = 0;
    this.boxes.forEach((box) => {
      if (name !== box.name) {
        name = box.name;
        ++travel;
      }
      box.color = this.colors[travel % this.colors.length];
    });
  }

  getBoxes(): PluginSelectionBox[] {
    const boxes: PluginSelectionBox[] = [];
    let current: undefined | PluginSelectionBox;
    if (this.plugins.length > 0) {
      current = new PluginSelectionBox(this.plugins[0].packageName, [this.pluginComponents.toArray()[0].nativeElement]);
    }

    let index = 1;
    while (index < this.plugins.length) {
      const name = this.plugins[index].packageName;
      if (name === current.name) {
        current.elements.push(this.pluginComponents.toArray()[index].nativeElement);
      } else {
        boxes.push(current);
        current = new PluginSelectionBox(name, [this.pluginComponents.toArray()[index].nativeElement]);
      }
      index++;
    }

    if (current !== undefined) {
      boxes.push(current);
    }
    return boxes;
  }

  splitDisconnectedBoxes(boxes: PluginSelectionBox[]): PluginSelectionBox[] {
    const newBoxes: PluginSelectionBox[] = [];

    boxes.forEach((box) => {
      const addBoxes = this.splitBox(box);
      newBoxes.push(...addBoxes);
    });

    return newBoxes;
  }

  splitBox(box: PluginSelectionBox): PluginSelectionBox[] {
    const boxes: PluginSelectionBox[] = [];
    box.elements.forEach((element) => {
      boxes.push(new PluginSelectionBox(box.name, [element]));
    });

    return this.combineBoxes(boxes);
  }

  combineBoxes(boxes: PluginSelectionBox[]): PluginSelectionBox[] {
    if (boxes.length < 2) {
      return boxes;
    }
    const newBoxes: PluginSelectionBox[] = [];
    let i = 0;
    while (i < boxes.length) {
      let connected = false;

      let j = i + 1;
      while (j < boxes.length) {
        if (boxes[i].connected(boxes[j])) {
          newBoxes.push(new PluginSelectionBox(boxes[i].name, boxes[i].elements.concat(boxes[j].elements)));
          connected = true;
          ++j;
          break;
        }

        ++j;
      }

      if (!connected) {
        newBoxes.push(boxes[i]);
        i++;
      } else {
        for (let k = i + 1; k < j - 1; ++k) {
          newBoxes.push(boxes[k]);
        }
        i = j;
      }
    }

    return newBoxes.length === boxes.length ? boxes : this.combineBoxes(newBoxes);
  }



}
