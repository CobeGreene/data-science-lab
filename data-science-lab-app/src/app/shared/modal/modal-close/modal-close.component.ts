import { Component, OnInit } from '@angular/core';
import { OverlayService } from '../../../services/overlay-service';

@Component({
  selector: 'app-modal-close',
  templateUrl: './modal-close.component.html',
  styleUrls: ['./modal-close.component.css']
})
export class ModalCloseComponent implements OnInit {

  constructor(private overlayService: OverlayService) { }

  ngOnInit() {
  }


  onExit(event: MouseEvent) {
    this.overlayService.close();
    event.preventDefault();
    event.stopPropagation();
  }

}
