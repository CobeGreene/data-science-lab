import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingStringCardComponent } from './setting-string-card.component';

describe('SettingStringCardComponent', () => {
  let component: SettingStringCardComponent;
  let fixture: ComponentFixture<SettingStringCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingStringCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingStringCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
