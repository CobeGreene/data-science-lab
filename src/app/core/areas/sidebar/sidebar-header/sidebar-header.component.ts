import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-header',
  templateUrl: './sidebar-header.component.html',
  styleUrls: ['./sidebar-header.component.css']
})
export class SidebarHeaderComponent implements OnInit {

  @Input() header: string;

  constructor() { }

  ngOnInit() {
  }

}
