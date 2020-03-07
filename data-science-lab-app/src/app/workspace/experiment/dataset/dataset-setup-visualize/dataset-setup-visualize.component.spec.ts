import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSetupVisualizeComponent } from './dataset-setup-visualize.component';

describe('DatasetSetupVisualizeComponent', () => {
  let component: DatasetSetupVisualizeComponent;
  let fixture: ComponentFixture<DatasetSetupVisualizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetSetupVisualizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSetupVisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
