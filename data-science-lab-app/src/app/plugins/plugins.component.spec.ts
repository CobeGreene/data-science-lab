import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginsComponent } from './plugins.component';
import { PluginService } from '../services/plugin_services/plugin.service';
import { MockPluginService } from '../services/plugin_services/mock_plugin.service';

describe('PluginsComponent', () => {
  let component: PluginsComponent;
  let fixture: ComponentFixture<PluginsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginsComponent ],
      providers: [
        { provide: PluginService, useClass: MockPluginService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
