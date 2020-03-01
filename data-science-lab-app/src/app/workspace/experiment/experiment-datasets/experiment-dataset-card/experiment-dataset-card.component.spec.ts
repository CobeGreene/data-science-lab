import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentDatasetCardComponent } from './experiment-dataset-card.component';

describe('ExperimentDatasetCardComponent', () => {
  let component: ExperimentDatasetCardComponent;
  let fixture: ComponentFixture<ExperimentDatasetCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentDatasetCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentDatasetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
