import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetFeaturesComponent } from './dataset-features.component';

describe('DatasetFeaturesComponent', () => {
  let component: DatasetFeaturesComponent;
  let fixture: ComponentFixture<DatasetFeaturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
