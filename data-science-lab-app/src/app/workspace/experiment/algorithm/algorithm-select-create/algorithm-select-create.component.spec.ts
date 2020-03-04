import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmSelectCreateComponent } from './algorithm-select-create.component';

describe('AlgorithmSelectCreateComponent', () => {
  let component: AlgorithmSelectCreateComponent;
  let fixture: ComponentFixture<AlgorithmSelectCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgorithmSelectCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmSelectCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
