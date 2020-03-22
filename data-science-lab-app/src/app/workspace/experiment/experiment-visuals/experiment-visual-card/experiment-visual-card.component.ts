import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { Visual } from '../../../../../../shared/models';
import { VisualizationService } from '../../../../services/visualization-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-experiment-visual-card',
  templateUrl: './experiment-visual-card.component.html',
  styleUrls: ['./experiment-visual-card.component.css']
})
export class ExperimentVisualCardComponent implements OnInit, OnDestroy {

  @Input() id: number;
  visual: Visual;

  @ViewChild('visualCmp', { static: false }) visualComponent: ElementRef<HTMLIFrameElement>;

  @Output() emitMove = new EventEmitter<{ event: MouseEvent, visual: Visual }>();
  @Output() emitExpand = new EventEmitter<{ event: MouseEvent, visual: Visual }>();

  constructor(
    private visualService: VisualizationService
  ) { }

  ngOnInit() {
    this.visual = this.visualService.get(this.id);

    this.visualService.visualUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.visual = value;
        }
      });
  }

  ngOnDestroy() {

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

  onDelete() {
    this.visualService.delete(this.id);
  }

}
