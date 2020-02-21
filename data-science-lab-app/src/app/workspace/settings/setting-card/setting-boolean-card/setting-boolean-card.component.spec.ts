import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingBooleanCardComponent } from './setting-boolean-card.component';

describe('SettingBooleanCardComponent', () => {
  let component: SettingBooleanCardComponent;
  let fixture: ComponentFixture<SettingBooleanCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingBooleanCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingBooleanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
