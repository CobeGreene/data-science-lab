import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmSetupCreateComponent } from './algorithm-setup-create.component';

describe('AlgorithmSetupCreateComponent', () => {
  let component: AlgorithmSetupCreateComponent;
  let fixture: ComponentFixture<AlgorithmSetupCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgorithmSetupCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmSetupCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
