import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmInputsCreateComponent } from './algorithm-inputs-create.component';

describe('AlgorithmInputsCreateComponent', () => {
  let component: AlgorithmInputsCreateComponent;
  let fixture: ComponentFixture<AlgorithmInputsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgorithmInputsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmInputsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
