import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceComponent } from './workspace.component';
import { CoreAreaService } from '../services/core-area-service';
import { Area } from '../models';
import { Subject } from 'rxjs';

describe('WorkspaceComponent', () => {
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;
  let service: CoreAreaService;
  let area: Area;

  beforeEach(async(() => {
    area = { top: 0, left: 0, height: 10, width: 100 };
    service = {
      getWorkspace() { return {...area}; },
      resizeEvent() { },
      registerWorkspace() { },
      sizeChanged: new Subject<void>()
    };

    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent],
      providers: [
        { provide: CoreAreaService, useValue: service }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set area of workspace', () => {
    expect(component.area).toEqual(area);
  });

  it('should assign different area when size change', () => {
    area.height = 200;
    service.sizeChanged.next();
    expect(component.area.height).toEqual(area.height);
  });


});
