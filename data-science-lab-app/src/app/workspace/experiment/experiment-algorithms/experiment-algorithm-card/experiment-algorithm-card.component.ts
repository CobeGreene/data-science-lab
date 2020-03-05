import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Algorithm } from '../../../../../../shared/models';
import { DropdownComponent } from '../../../../shared/dropdown/dropdown.component';
import { AlgorithmService } from '../../../../services/algorithm-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DeleteAlgorithmComponent } from '../../../../shared/algorithm/delete-algorithm/delete-algorithm.component';

@Component({
  selector: 'app-experiment-algorithm-card',
  templateUrl: './experiment-algorithm-card.component.html',
})
export class ExperimentAlgorithmCardComponent implements OnInit, OnDestroy {
  
  @Input() id: number;
  algorithm: Algorithm;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: DropdownComponent;
  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteAlgorithmComponent;

  constructor(private algorithmService: AlgorithmService) { }

  ngOnInit() {
    this.algorithm = this.algorithmService.get(this.id);

    this.algorithmService.algorithmUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.algorithm = value;
        }
      });
  }

  ngOnDestroy() {

  }

  onOptions(event: MouseEvent) {
    this.optionsComponent.open(event);
  }

  onStart(event: MouseEvent) {
    this.algorithmService.start(this.id);
    this.optionsComponent.close();
  }
  
  onStop(event: MouseEvent) {
    this.algorithmService.stop(this.id);
    this.optionsComponent.close();
  }

  onDelete(event: MouseEvent) {
    this.deleteComponent.open(event);
  }


}
