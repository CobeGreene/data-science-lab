import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingNumberCardComponent } from './setting-number-card.component';

describe('SettingNumberCardComponent', () => {
  let component: SettingNumberCardComponent;
  let fixture: ComponentFixture<SettingNumberCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingNumberCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingNumberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
