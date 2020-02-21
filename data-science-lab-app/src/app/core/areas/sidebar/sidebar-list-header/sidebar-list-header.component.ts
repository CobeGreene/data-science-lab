import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar-list-header',
  templateUrl: './sidebar-list-header.component.html',
  styleUrls: ['./sidebar-list-header.component.css']
})
export class SidebarListHeaderComponent implements OnInit {

  @Input() header: string;

  @Input() isOpen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
