import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Area } from '../../../models/area';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-experiment-header',
  templateUrl: './experiment-header.component.html',
  styleUrls: ['./experiment-header.component.css']
})
export class ExperimentHeaderComponent implements OnInit, OnDestroy {

  area: Area;
  isExpanded: boolean;

  @Output() emitExpanded = new EventEmitter<boolean>();

  constructor(private coreAreaService: CoreAreaService) { }

  ngOnInit() {
    
    this.coreAreaService.sizeChanged
    .pipe(untilComponentDestroyed(this))
    .subscribe(() => {
      this.area = this.coreAreaService.getWorkspace();
    });
    
    this.area = this.coreAreaService.getWorkspace();
    this.isExpanded = true;

    this.emitExpanded.emit(this.isExpanded);
  }

  ngOnDestroy() {

  }

  onToggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.emitExpanded.emit(this.isExpanded);
  }

}
