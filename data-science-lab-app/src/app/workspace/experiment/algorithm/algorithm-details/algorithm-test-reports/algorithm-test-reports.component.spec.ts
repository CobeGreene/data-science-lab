import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmTestReportsComponent } from './algorithm-test-reports.component';

describe('AlgorithmTestReportsComponent', () => {
  let component: AlgorithmTestReportsComponent;
  let fixture: ComponentFixture<AlgorithmTestReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgorithmTestReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmTestReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
