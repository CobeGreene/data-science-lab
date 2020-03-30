import { Component, OnInit, OnDestroy, ViewContainerRef, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { ExperimentService } from '../../../services/experiment-service/experiment.service';
import { Experiment, ExperimentState } from '../../../../../shared/models';
import { ShortcutService } from '../../../services/shortcut-service';

@Component({
  selector: 'app-load-experiment',
  templateUrl: './load-experiment.component.html',
  styleUrls: ['./load-experiment.component.css']
})
export class LoadExperimentComponent extends ModalComponent implements OnInit, OnDestroy, AfterViewInit {

  experiments: Experiment[];
  selected: number;

  @ViewChildren('experimentCmp', { read: ElementRef }) experimentComponents: QueryList<ElementRef<HTMLElement>>;

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef,
    overlayService: OverlayService,
    private experimentService: ExperimentService,
    private shortcutService: ShortcutService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.experiments = this.experimentService.all().filter(x => x.state === ExperimentState.Unloaded);
    this.selected = 0;
  }

  onOpen() {
    this.experiments = this.experimentService.all().filter(x => x.state === ExperimentState.Unloaded);
    this.selected = 0;
    this.shortcutService.subscribe('arrowup', this.onMoveUp);
    this.shortcutService.subscribe('arrowdown', this.onMoveDown);
    this.shortcutService.subscribe('enter', this.onEnter);
  }

  onClose() {
    this.shortcutService.unsubscribe('arrowup', this.onMoveUp);
    this.shortcutService.unsubscribe('arrowdown', this.onMoveDown);
    this.shortcutService.unsubscribe('enter', this.onEnter);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
  }

  onMoveUp = () => {
      if (this.selected > 0) {
        this.selected -= 1;
        this.scrollIntoViewExperimentSelected();
    }
  }

  onMoveDown = () => {
    if (this.selected < this.experiments.length - 1 && this.experiments.length !== 0) {
      this.selected += 1;
      this.scrollIntoViewExperimentSelected();
    }
  }


  onEnter = () => {
    this.onSelected(this.selected);
  }

  onSelected(selected: number) {
    this.experimentService.load(this.experiments[selected].id);
  }

  scrollIntoViewExperimentSelected() {
    this.scrollIntoViewSelected(this.selected);
}

scrollIntoViewSelected(select: number) {
    const element = this.experimentComponents.toArray()[select];
    if (element !== undefined) {
        (element.nativeElement).scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'start' });
    }
}


}
