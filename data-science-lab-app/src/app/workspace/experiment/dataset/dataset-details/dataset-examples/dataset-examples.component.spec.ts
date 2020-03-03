import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetExamplesComponent } from './dataset-examples.component';

describe('DatasetExamplesComponent', () => {
  let component: DatasetExamplesComponent;
  let fixture: ComponentFixture<DatasetExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
