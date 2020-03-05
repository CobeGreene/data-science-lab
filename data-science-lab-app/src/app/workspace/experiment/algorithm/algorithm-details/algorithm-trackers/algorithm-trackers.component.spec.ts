import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgorithmTrackersComponent } from './algorithm-trackers.component';

describe('AlgorithmTrackersComponent', () => {
  let component: AlgorithmTrackersComponent;
  let fixture: ComponentFixture<AlgorithmTrackersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgorithmTrackersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgorithmTrackersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
