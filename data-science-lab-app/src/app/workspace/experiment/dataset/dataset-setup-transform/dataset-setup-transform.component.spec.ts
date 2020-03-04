import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetSetupTransformComponent } from './dataset-setup-transform.component';

describe('DatasetSetupTransformComponent', () => {
  let component: DatasetSetupTransformComponent;
  let fixture: ComponentFixture<DatasetSetupTransformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasetSetupTransformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetSetupTransformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
