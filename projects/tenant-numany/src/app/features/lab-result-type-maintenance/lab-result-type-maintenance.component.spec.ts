import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabResultTypeMaintenanceComponent } from './lab-result-type-maintenance.component';

describe('LabResultTypeMaintenanceComponent', () => {
  let component: LabResultTypeMaintenanceComponent;
  let fixture: ComponentFixture<LabResultTypeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabResultTypeMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabResultTypeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
