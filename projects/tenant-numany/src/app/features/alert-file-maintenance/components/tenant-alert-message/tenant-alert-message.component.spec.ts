import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantAlertMessageComponent } from './tenant-alert-message.component';

describe('TenantAlertMessageComponent', () => {
  let component: TenantAlertMessageComponent;
  let fixture: ComponentFixture<TenantAlertMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantAlertMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantAlertMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
