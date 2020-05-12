import { Component, OnInit, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Visual } from '../../../../../../../shared/models';
import { VisualizationService } from '../../../../../services/visualization-service';
import { DropdownComponent } from '../../../../../shared/dropdown/dropdown.component';
import { RenameVisualComponent } from '../../../../../shared/visual/rename-visual/rename-visual.component';
import { DeleteVisualComponent } from '../../../../../shared/visual/delete-visual/delete-visual.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-experiment-visual-grid-card',
  templateUrl: './experiment-visual-grid-card.component.html',
  styleUrls: ['./experiment-visual-grid-card.component.css']
})
export class ExperimentVisualGridCardComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() id: number;
  visual: Visual;
  @ViewChild('visualCmp', { static: false }) visualComponent: ElementRef<HTMLIFrameElement>;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;
  @ViewChild('renameCmp', { static: false }) renameComponent: RenameVisualComponent;
  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteVisualComponent;

  constructor(private visualService: VisualizationService) { }

  ngOnInit() {
    this.visual = this.visualService.get(this.id);

    this.visualService.visualUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.visual.id) {
          this.visual = value;
        }
      });
  }

  ngAfterViewInit() {
    this.visualComponent.nativeElement.srcdoc = this.visual.srcdoc;
  }

  ngOnDestroy() {

  }

  onOptions(event: MouseEvent) {
    this.optionsComponent.open(event);
  }

  onDelete(event: MouseEvent) {
    this.deleteComponent.open(event);
  }

  onRename(event: MouseEvent) {
    this.renameComponent.open(event);
  }


}
