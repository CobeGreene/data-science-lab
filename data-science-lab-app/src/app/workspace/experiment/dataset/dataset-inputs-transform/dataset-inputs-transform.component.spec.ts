import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetInputsTransformComponent } from './dataset-inputs-transform.component';

describe('DatasetInputsTransformComponent', () => {
  let component: DatasetInputsTransformComponent;
  let fixture: ComponentFixture<DatasetInputsTransformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetInputsTransformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetInputsTransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
