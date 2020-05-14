import { Component, OnInit, Output, EventEmitter, Input, ViewChild, HostBinding, OnDestroy } from '@angular/core';
import { PluginDataInput } from 'data-science-lab-core';
import { Feature } from '../../../../../shared/models';
import { IndexValue } from '../../../models';
import { PopupComponent } from '../../popup/popup.component';
import { CoreAreaService } from '../../../services/core-area-service/core-area.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-plugin-input',
  templateUrl: './plugin-input.component.html',
  styleUrls: ['./plugin-input.component.css']
})
export class PluginInputComponent implements OnInit, OnDestroy {

  @ViewChild('popupCmp', { static: false }) popupComponent: PopupComponent;
  @Output() emitReturn = new EventEmitter<void>();
  @Output() emitExit = new EventEmitter<void>();
  @Output() emitSubmit = new EventEmitter<{ [id: string]: number[] }>();
  @Output() emitValues = new EventEmitter<{ [id: string]: number[] }>();

  @Input() features: Feature[];
  @Input() inputs: PluginDataInput[];
  @Input() plugin: Plugin;

  current = 0;
  @Input() isWaiting: boolean;
  valid = false;
  @Input() inputDict: { [id: string]: number[] };

  @HostBinding('class.sidebar-expanded') sidebarExpanded: boolean;

  constructor(private coreAreaService: CoreAreaService) { }

  get inputLabels(): string[] {
    return this.inputs.map(v => v.label);
  }

  get currentValid(): boolean {
    return this.isInputValid(this.current);
  }

  get compatibleFeatures(): IndexValue<Feature>[] {
    return this.getCompatibleFeatures(this.current);
  }

  get remainingFeatures(): IndexValue<Feature>[] {
    return this.getRemainingFeatures(this.current);
  }

  onReturn() {
    if (!this.isWaiting) {
      this.emitReturn.emit();
    }
  }

  onExit() {
    if (!this.isWaiting) {
      this.emitExit.emit();
    }
  }

  onSubmit() {
    if (this.valid && !this.isWaiting) {
      this.isWaiting = true;
      this.emitSubmit.emit(this.inputDict);
    }
  }

  ngOnInit() {
    if (this.inputDict === undefined) {
      this.inputDict = {};
      this.inputs.forEach(input => {
        this.inputDict[input.id] = [];
      });
      this.valid = this.isValid();
    } else {
      this.valid = this.isValid();
    }

    this.coreAreaService.sidebarChanged
      .pipe(untilComponentDestroyed(this))
      .subscribe((value) => {
        this.sidebarExpanded = value;
      });
      
    this.sidebarExpanded = this.coreAreaService.isSidebarExpanded();

  }

  ngOnDestroy() {
    
  }

  onInputSelect(index: number) {
    this.current = index;
  }

  onSelect(event: MouseEvent, index: number) {
    if (this.isWaiting) {
      this.popupComponent.open(event, 'Waiting...', 'warning');
    } else if (this.inputs[this.current].max && this.inputDict[this.inputs[this.current].id].length + 1 > this.inputs[this.current].max) {
      this.popupComponent.open(event, 'Maximum input reach', 'error');
    } else {
      this.inputDict[this.inputs[this.current].id].push(index);
      this.valid = this.isValid();
      this.emitValues.next(this.inputDict);
    }
  }

  onUnselect(event: MouseEvent, index: number) {
    if (this.isWaiting) {
      this.popupComponent.open(event, 'Waiting...', 'warning');
    } else {
      this.inputDict[this.inputs[this.current].id].splice(index, 1);
      this.valid = this.isValid();
      this.emitValues.next(this.inputDict);
    }
  }

  onRight() {
    this.current = this.next(this.current);
  }

  onLeft() {
    this.current = this.previous(this.current);
  }

  onRestart() {
    if (!this.isWaiting) {
      this.inputs.forEach(input => {
        this.inputDict[input.id] = [];
      });
      this.valid = this.isValid();
      this.emitValues.next(this.inputDict);
    }
  }

  onMinAutofill() {
    if (this.isWaiting) {
      return;
    }
    this.fillMiniumumInputs(this.current);
    this.emitValues.next(this.inputDict);
  }

  onMaxAutofill() {
    if (this.isWaiting) {
      return;
    }
    this.fillMaximumInputs(this.current);
    this.emitValues.next(this.inputDict);
  }

  private isValid(): boolean {
    return this.inputs.findIndex((_, index) => !this.isInputValid(index)) === -1;
  }

  private isInputValid(index: number) {
    if (this.inputDict[this.inputs[index].id].length < this.inputs[index].min) {
      return false;
    }
    if (this.inputs[index].max && this.inputDict[this.inputs[index].id].length > this.inputs[index].max) {
      return false;
    }
    return true;
  }

  private isInsideInputDictionary(index: number) {
    for (const key in this.inputDict) {
      if (this.inputDict[key]) {
        for (const cmpIndex of this.inputDict[key]) {
          if (cmpIndex === index) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private getAllIndexValueFeatures(): IndexValue<Feature>[] {
    return this.features.map((value, index) => ({ value, index }));
  }

  private getCompatibleFeatures(index: number): IndexValue<Feature>[] {
    return this.getAllIndexValueFeatures()
      .filter(feature => feature.value.type === this.inputs[index].type &&
        !this.isInsideInputDictionary(feature.index));
  }

  private isInIndexValueArray(index: number, features: IndexValue<Feature>[]) {
    return features.findIndex(feature => feature.index === index) >= 0;
  }

  private getRemainingFeatures(index: number): IndexValue<Feature>[] {
    const compatibleFeatures = this.getCompatibleFeatures(index);
    return this.getAllIndexValueFeatures()
      .filter(feature => !(this.isInsideInputDictionary(feature.index) || this.isInIndexValueArray(feature.index, compatibleFeatures)));
  }

  private fillMiniumumInputs(start: number) {
    let traverse = start;
    do {
      while (!this.isInputValid(traverse)) {
        const features = this.getCompatibleFeatures(traverse);
        if (features.length > 0) {
          this.inputDict[this.inputs[traverse].id].push(features[0].index);
        } else {
          const find = this.findExtraFeatureInInput(traverse);
          if (!find) {
            throw new Error(`Input is not compatiable with features`);
          } else {
            this.inputDict[this.inputs[traverse].id].push(...this.inputDict[find.id].splice(0, 1));
          }
        }
      }
      traverse = this.next(traverse);
    } while (traverse !== start);
    this.valid = true;
  }

  private next(index: number): number {
    return (index + 1) % this.inputs.length;
  }

  private previous(index: number): number {
    --index;
    if (index < 0) {
      index = this.inputs.length - 1;
    }
    return index;
  }

  private findExtraFeatureInInput(exclude: number): PluginDataInput {
    return this.inputs.find((value, index) => {
      return this.inputDict[value.id].length > 0 &&
        this.inputDict[value.id].length > value.min &&
        value.type === this.inputs[exclude].type &&
        exclude !== index;
    });
  }

  private findPluginInputWithSpace(feature: Feature): PluginDataInput {
    return this.inputs.find((value) => {
      if (value.type !== feature.type) {
        return false;
      }
      if (value.max) {
        if (this.inputDict[value.id].length >= value.max) {
          return false;
        }
      }
      return true;
    });
  }

  private fillMaximumInputs(start: number) {
    this.fillMiniumumInputs(start);
    const features = this.remainingFeatures.slice().concat(this.compatibleFeatures.slice());
    while (features.length > 0) {
      const current = features[0];
      const find = this.findPluginInputWithSpace(current.value);
      features.splice(0, 1);
      if (find) {
        this.inputDict[find.id].push(current.index);
      }
    }
    this.valid = true;
  }


}
