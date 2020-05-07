import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DropdownComponent } from '../../../../../shared/dropdown/dropdown.component';
import { Algorithm } from '../../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RouterService } from '../../../../../services/router-service';
import { AlgorithmService } from '../../../../../services/algorithm-service';
import { EditAlgorithmComponent } from '../../../../../shared/algorithm/edit-algorithm/edit-algorithm.component';
import { DeleteAlgorithmComponent } from '../../../../../shared/algorithm/delete-algorithm/delete-algorithm.component';

@Component({
  selector: 'app-algorithm-header',
  templateUrl: './algorithm-header.component.html',
  styleUrls: ['./algorithm-header.component.css']
})
export class AlgorithmHeaderComponent implements OnInit, OnDestroy {

  id: number;
  algorithm: Algorithm;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: ElementRef;
  @ViewChild('optionsDropdown', { static: false }) optionsDropdown: DropdownComponent;

  @ViewChild('editCmp', { static: false}) editComponent: EditAlgorithmComponent;
  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteAlgorithmComponent;

  @ViewChild('exportDropdown', { static: false }) exportDropdown: DropdownComponent;
  @ViewChild('exportCmp', { static: false }) exportComponent: ElementRef;

  constructor(
    private routerService: RouterService,
    private algorithmService: AlgorithmService
  ) { }

  ngOnInit() {

    this.id = this.routerService.data().algorithmId;
    this.algorithm = this.algorithmService.get(this.id);


    this.algorithmService.algorithmUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.algorithm = value;
        }
      });

    this.routerService.changed()
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.id = this.routerService.data().algorithmId;
        this.algorithm = this.algorithmService.get(this.id);
      });
  }

  ngOnDestroy() {

  }

  onStart(_: Event) {
    this.algorithmService.start(this.id);
  }

  onStop(_: Event) {
    this.algorithmService.stop(this.id);
  }

  onOptions(event: MouseEvent) {
    this.optionsDropdown.open(event, this.optionsComponent);
  }

  onEdit(event: MouseEvent) {
    this.editComponent.open(event);
  }

  onDelete(event: MouseEvent) {
    this.deleteComponent.open(event);
  }

  onExportDropdown(event: MouseEvent) {
    this.exportDropdown.open(event, this.exportComponent);
  }

  onExport(language: string) {
    this.algorithmService.export(this.id, language);
    this.exportDropdown.close();
  }

}
