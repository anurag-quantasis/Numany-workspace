import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPayorTypeMaintenanceComponent } from './patient-payor-type-maintenance.component';

describe('PatientPayorTypeMaintenanceComponent', () => {
  let component: PatientPayorTypeMaintenanceComponent;
  let fixture: ComponentFixture<PatientPayorTypeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientPayorTypeMaintenanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientPayorTypeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
