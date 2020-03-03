import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';
import { Dataset, Feature } from '../../../../../shared/models';
import { ModalComponent } from '../../modal/modal.component';
import { Overlay } from '@angular/cdk/overlay';
import { OverlayService } from '../../../services/overlay-service';
import { DatasetService } from '../../../services/dataset-service';

@Component({
  selector: 'app-join-dataset',
  templateUrl: './join-dataset.component.html',
  styleUrls: ['./join-dataset.component.css']
})
export class JoinDatasetComponent extends ModalComponent implements OnInit {

  @Input() id: number;

  joinDatasets: Dataset[];
  otherDatasets: Dataset[];

  constructor(
    overlay: Overlay, viewContainerRef: ViewContainerRef,
    overlayService: OverlayService, private datasetService: DatasetService) {
    super(overlay, viewContainerRef, overlayService);
  }

  ngOnInit() {
    this.joinDatasets = [];
    this.otherDatasets = [];
  }

  totalExamples(): number {
    return this.joinDatasets.map(value => value.examples).reduce((sum, current) => sum + current, 0);
  }

  onOpen() {
    this.joinDatasets = [
      this.datasetService.get(this.id)
    ];
    this.otherDatasets = this.getCompatible();
  }

  onUnjoin(index: number) {
    this.otherDatasets.push(...this.joinDatasets.splice(index, 1));
    if (this.joinDatasets.length === 0) {
      this.otherDatasets = this.getCompatible();
    }
  }

  onJoin(index: number) {
    if (this.joinDatasets.length === 0) {
      this.joinDatasets = [
        ...this.otherDatasets.splice(index, 1)
      ];
      this.otherDatasets = this.getCompatible();
    } else {
      this.joinDatasets.push(...this.otherDatasets.splice(index, 1));
    }
  }

  onJoinDatasets(event: Event) {
    if (this.joinDatasets.length > 1) {
      this.datasetService.join(this.joinDatasets.map(value => value.id));
      this.overlayService.close();
    }
  }

  getCompatible(): Dataset[] {
    const experimentId = this.datasetService.get(this.id).experimentId;
    if (this.joinDatasets.length === 0) {
      return this.datasetService.all(experimentId);
    } else {
      const compare = this.joinDatasets[0];
      const sortedFeatures = this.getSortedFeatures(compare);
      return this.datasetService.all(experimentId).filter((value) => {
        if (this.joinDatasets.find(current => value.id === current.id)) {
          return false;
        }
        const features = this.getSortedFeatures(value);
        if (sortedFeatures.length === features.length) {
          for (let i = 0; i < sortedFeatures.length; ++i) {
            if (sortedFeatures[i].name !== features[i].name) {
              return false;
            }
            if (sortedFeatures[i].type !== features[i].type) {
              return false;
            }
          }  
          return true;
        }
        return false;
      });
    }
  }

  getSortedFeatures(dataset: Dataset): Feature[] {
    return dataset.features.sort((lhs: Feature, rhs: Feature) => {
      if (lhs.name < rhs.name) {
        return -1;
      } 
      if (lhs.name > rhs.name) {
        return 1;
      }
      return 0;
    });
  }
}
