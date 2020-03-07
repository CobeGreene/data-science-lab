import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetInputsVisualizeComponent } from './dataset-inputs-visualize.component';

describe('DatasetInputsVisualizeComponent', () => {
  let component: DatasetInputsVisualizeComponent;
  let fixture: ComponentFixture<DatasetInputsVisualizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetInputsVisualizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetInputsVisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
