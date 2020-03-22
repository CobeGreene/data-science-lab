import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.css']
})
export class ModalHeaderComponent implements OnInit {

  @Input() header: string;

  constructor() { }

  ngOnInit() {
  }

}
