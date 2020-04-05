import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Visual } from '../../../../../../../shared/models';
import { VisualizationService } from '../../../../../services/visualization-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DropdownComponent } from '../../../../../shared/dropdown/dropdown.component';
import { RenameVisualComponent } from '../../../../../shared/visual/rename-visual/rename-visual.component';


@Component({
  selector: 'app-experiment-visual-workspace-card',
  templateUrl: './experiment-visual-workspace-card.component.html',
  styleUrls: ['./experiment-visual-workspace-card.component.css']
})
export class ExperimentVisualWorkspaceCardComponent implements OnInit, OnDestroy, AfterViewInit {
  
  @Input() visual: Visual;

  @ViewChild('visualCmp', { static: false }) visualComponent: ElementRef<HTMLIFrameElement>;
  @ViewChild('optionsDropdown', { static: false }) optionsDropdown: DropdownComponent;
  
  @ViewChild('renameCmp', { static: false }) renameComponent: DropdownComponent;
  @ViewChild('inputCmp', { static: false }) inputComponent: RenameVisualComponent;

  @Output() emitMove = new EventEmitter<{ event: MouseEvent, visual: Visual }>();
  @Output() emitExpand = new EventEmitter<{ event: MouseEvent, visual: Visual }>();

  constructor(
    private visualService: VisualizationService
  ) { }

  ngOnInit() {
    this.visualService.visualUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.visual.id) {
          this.visual.name = value.name;
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
    this.visualService.delete(this.visual.id);
  }

  onRename(event: MouseEvent) {
    this.renameComponent.open(event, this.visualComponent);
    this.inputComponent.focus();
  }

  onOpenContext(event: MouseEvent) {
    this.optionsDropdown.open(event);
  }

  onShow(event: MouseEvent) {
    this.visualService.show(this.visual.id);
    this.optionsDropdown.close();
  }

}
