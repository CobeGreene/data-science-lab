import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-plugin-input-valid',
  templateUrl: './plugin-input-valid.component.html',
  styleUrls: ['./plugin-input-valid.component.css']
})
export class PluginInputValidComponent implements OnInit {

  @Input() valid: boolean;

  constructor() { }

  ngOnInit() {
  }

}
