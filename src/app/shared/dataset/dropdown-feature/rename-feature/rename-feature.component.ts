import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DatasetService } from '../../../../services/dataset-service';
import { OverlayService } from '../../../../services/overlay-service';

@Component({
  selector: 'app-rename-feature',
  templateUrl: './rename-feature.component.html',
})
export class RenameFeatureComponent implements OnInit, AfterViewInit {

  @Input() id: number;
  @Input() index: number;

  name: string;

  @ViewChild('inputCmp', { static: true }) inputComponent: ElementRef<HTMLInputElement>;

  constructor(private datasetService: DatasetService, private overlayService: OverlayService) {

  }

  ngOnInit() {
    this.name = this.datasetService.get(this.id).features[this.index].name;

  }


  ngAfterViewInit() {
  }

  focus() {
    this.inputComponent.nativeElement.focus();
  }

  onEnter() {
    this.datasetService.renameFeature(this.id, this.index, this.name);
    this.overlayService.close();
  }


}
