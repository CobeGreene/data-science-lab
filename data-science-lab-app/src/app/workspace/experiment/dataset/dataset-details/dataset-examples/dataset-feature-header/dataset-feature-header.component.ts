import { Component, OnInit, Input } from '@angular/core';
import { Feature } from '../../../../../../../../shared/models';
import { RouterService } from '../../../../../../services/router-service';

@Component({
  selector: 'app-dataset-feature-header',
  templateUrl: './dataset-feature-header.component.html',
})
export class DatasetFeatureHeaderComponent implements OnInit {

  @Input() index: number;
  @Input() feature: Feature;

  id: number;

  constructor(private routerService: RouterService) {

  }

  ngOnInit() {
    this.id = this.routerService.data().datasetId;
  }

}
