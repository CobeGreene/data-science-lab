import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceAreaComponent } from './workspace-area.component';

describe('WorkspaceAreaComponent', () => {
  let component: WorkspaceAreaComponent;
  let fixture: ComponentFixture<WorkspaceAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
