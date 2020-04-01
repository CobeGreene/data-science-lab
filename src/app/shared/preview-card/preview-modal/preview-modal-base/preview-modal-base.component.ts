import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preview-modal-base',
  templateUrl: './preview-modal-base.component.html',
  styleUrls: ['./preview-modal-base.component.css']
})
export class PreviewModalBaseComponent implements OnInit {

  @Input() value: any;
  @Input() depth: number;
  @Input() prefix: string = "";
  type: string;
  isExpanded: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.value instanceof Array) {
      this.type = "array";
    } else {
      this.type = typeof this.value;
    }
    
  }

  onExpand() {
    this.isExpanded = !this.isExpanded;
  }

}
