import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacistInterventionTypeMaintenanceComponent } from './pharmacist-intervention-type-maintenance.component';

describe('PharmacistInterventionTypeMaintenanceComponent', () => {
  let component: PharmacistInterventionTypeMaintenanceComponent;
  let fixture: ComponentFixture<PharmacistInterventionTypeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmacistInterventionTypeMaintenanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PharmacistInterventionTypeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
