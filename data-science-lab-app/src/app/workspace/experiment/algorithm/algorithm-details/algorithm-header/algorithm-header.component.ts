import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { DropdownComponent } from '../../../../../shared/dropdown/dropdown.component';
import { Algorithm } from '../../../../../../../shared/models';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { RouterService } from '../../../../../services/router-service';
import { AlgorithmService } from '../../../../../services/algorithm-service';

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

}
