import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Feature } from '../../../../../../../../shared/models';
import { DropdownFeatureComponent } from '../../../../../../shared/dataset/dropdown-feature/dropdown-feature.component';
import { RouterService } from '../../../../../../services/router-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';


@Component({
  selector: 'app-dataset-feature-card',
  templateUrl: './dataset-feature-card.component.html'
})
export class DatasetFeatureCardComponent implements OnInit, OnDestroy {

  @Input() index: number;
  @Input() feature: Feature;

  id: number;

  @ViewChild('featureCmp', { static: false }) featureComponent: ElementRef;
  @ViewChild('dropdownCmp', { static: false }) dropdownComponent: DropdownFeatureComponent;

  constructor(private routerService: RouterService) { }

  ngOnInit() {
    this.id = this.routerService.data().datasetId;
    
    this.routerService.changed()
    .pipe(untilComponentDestroyed(this))
    .subscribe((value) => {
        this.id = this.routerService.data().datasetId;
        });
  }

  ngOnDestroy() {

  }

  onFeatureMenu(event: MouseEvent) {
    this.dropdownComponent.open(event, this.featureComponent);
  }

}
