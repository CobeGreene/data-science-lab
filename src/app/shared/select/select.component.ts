import {
  Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewContainerRef,
  ViewChild, TemplateRef, ElementRef, ChangeDetectorRef
} from '@angular/core';
import { OverlayService } from '../../services/overlay-service';
import { ShortcutService } from '../../services/shortcut-service';
import { OverlayComponent } from '../overlay/overlay.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent extends OverlayComponent implements OnInit, OnDestroy {

  @Input() value: string;

  @Input() options: string[];

  @Output() emitChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() emitIndexChange = new EventEmitter<number>();

  @ViewChild('optionsCmp', { static: false }) optionsComponent: TemplateRef<void>;
  @ViewChild('selectCmp', { static: false }) selectComponent: ElementRef;

  selected: number;

  constructor(
    overlay: Overlay,
    viewContainerRef: ViewContainerRef,
    overlayService: OverlayService,
    private ref: ChangeDetectorRef,
    private shortcutService: ShortcutService) {
    super(overlay, viewContainerRef, overlayService);
  }

  toggleOpen(event: MouseEvent) {
    if (this.overlayRef) {
      this.overlayService.close();
    } else {
      this.open(event);
    }
  }

  positionStrategy() {
    return this.overlay.position()
      .flexibleConnectedTo(this.selectComponent)
      .withPositions([{
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
      }, {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      }]);
  }

  templateRef() {
    return this.optionsComponent;
  }

  onOpen() {
  }

  onClose() {
  }

  ngOnInit() {
    this.selected = this.options.findIndex((value) => {
      return value === this.value;
    });

  }

  ngOnDestroy() {

  }

  onSelected(index: number) {
    this.close();
    this.selected = index;
    this.value = this.options[index];
    this.emitChange.emit(this.value);
    this.emitIndexChange.emit(index);
  }


}
