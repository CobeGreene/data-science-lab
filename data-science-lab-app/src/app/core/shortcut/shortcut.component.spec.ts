import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutComponent } from './shortcut.component';
import { ShortcutService } from '../../services/shortcut-service';
import { KeyboardShortcutsModule } from 'ng-keyboard-shortcuts';

describe('ShortcutComponent', () => {
  let component: ShortcutComponent;
  let fixture: ComponentFixture<ShortcutComponent>;
  let shortcutService: ShortcutService;

  beforeEach(async(() => {
    shortcutService = {
      shortcuts: [],
      subscribe() {},
      unsubscribe() {}
    };
    TestBed.configureTestingModule({
      declarations: [ ShortcutComponent ],
      imports: [
        KeyboardShortcutsModule
      ],
      providers: [
        { provide: ShortcutService, useValue: shortcutService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain zero shortcuts', () => {
    expect(component.shortcuts.length).toBe(0);
  });

});
