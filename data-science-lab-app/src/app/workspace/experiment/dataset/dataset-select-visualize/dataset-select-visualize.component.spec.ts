import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSelectVisualizeComponent } from './dataset-select-visualize.component';

describe('DatasetSelectVisualizeComponent', () => {
  let component: DatasetSelectVisualizeComponent;
  let fixture: ComponentFixture<DatasetSelectVisualizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetSelectVisualizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSelectVisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
