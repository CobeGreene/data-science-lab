import { Component, OnInit, AfterViewInit, OnDestroy,  } from '@angular/core';
import { OverlayService } from '../../../services/overlay-service';
import { ShortcutService } from '../../../services/shortcut-service';
import { Shortcuts } from '../../../../../shared/shortcuts';

@Component({
  selector: 'app-modal-close',
  templateUrl: './modal-close.component.html',
  styleUrls: ['./modal-close.component.css']
})
export class ModalCloseComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private overlayService: OverlayService,
    private shortcutService: ShortcutService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.shortcutService.subscribe(Shortcuts.Escape, this.onClose);
  }


  ngOnDestroy() {
    this.shortcutService.unsubscribe(Shortcuts.Escape, this.onClose);
  }

  onClose = () => {
    this.overlayService.close();
  }


  onExit(event: MouseEvent) {
    this.overlayService.close();
    event.preventDefault();
    event.stopPropagation();
  }

}
