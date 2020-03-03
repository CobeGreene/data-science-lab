import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DropdownComponent } from '../../../../../shared/dropdown/dropdown.component';
import { RouterService } from '../../../../../services/router-service';
import { DatasetService } from '../../../../../services/dataset-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { DeleteDatasetComponent } from '../../../../../shared/dataset/delete-dataset/delete-dataset.component';
import { EditDatasetComponent } from '../../../../../shared/dataset/edit-dataset/edit-dataset.component';

@Component({
  selector: 'app-dataset-header',
  templateUrl: './dataset-header.component.html',
  styleUrls: ['./dataset-header.component.css']
})
export class DatasetHeaderComponent implements OnInit, OnDestroy {

  id: number;
  name: string;

  @ViewChild('optionsCmp', { static: false }) optionsComponent: ElementRef;
  @ViewChild('optionsDropdown', { static: false }) optionsDropdown: DropdownComponent;

  @ViewChild('editCmp', { static: false }) editComponent: EditDatasetComponent;
  @ViewChild('deleteCmp', { static: false }) deleteComponent: DeleteDatasetComponent;

  constructor(
    private routerService: RouterService,
    private datasetService: DatasetService) { 

    }

  ngOnInit() {
    this.id = this.routerService.data().datasetId;

    this.datasetService.datasetUpdated
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        if (value.id === this.id) {
          this.name = value.name;
        }
      });

    this.name = this.datasetService.get(this.id).name;
  }

  ngOnDestroy() {

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

}
