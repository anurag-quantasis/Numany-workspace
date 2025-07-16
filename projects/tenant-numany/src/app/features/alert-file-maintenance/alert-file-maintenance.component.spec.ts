import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertFileMaintenanceComponent } from './alert-file-maintenance.component';

describe('AlertFileMaintenanceComponent', () => {
  let component: AlertFileMaintenanceComponent;
  let fixture: ComponentFixture<AlertFileMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertFileMaintenanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertFileMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
