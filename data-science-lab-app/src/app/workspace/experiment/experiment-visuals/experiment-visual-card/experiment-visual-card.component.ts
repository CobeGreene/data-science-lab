import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, HostListener } from '@angular/core';
import { Visual } from '../../../../../../shared/models';


@Component({
  selector: 'app-experiment-visual-card',
  templateUrl: './experiment-visual-card.component.html',
  styleUrls: ['./experiment-visual-card.component.css']
})
export class ExperimentVisualCardComponent implements OnInit {

  @Input() visual: Visual;

  @ViewChild('visualCmp', { static: false }) visualComponent: ElementRef<HTMLIFrameElement>;

  @Output() emitMove = new EventEmitter<{ event: MouseEvent, visual: Visual }>();
  @Output() emitExpand = new EventEmitter<{ event: MouseEvent, visual: Visual }>();

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.visualComponent.nativeElement.srcdoc = this.visual.srcdoc;
  }

  onMouseDownMove = (event: MouseEvent) => {
    this.emitMove.emit({ event, visual: this.visual });
  }

  onMouseDownExpand(event: MouseEvent) {
    this.emitExpand.emit({ event, visual: this.visual });

  }

}
