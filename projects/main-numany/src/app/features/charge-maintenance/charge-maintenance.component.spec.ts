import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeMaintenanceComponent } from './charge-maintenance.component';

describe('ChargeMaintenanceComponent', () => {
  let component: ChargeMaintenanceComponent;
  let fixture: ComponentFixture<ChargeMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeMaintenanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChargeMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
