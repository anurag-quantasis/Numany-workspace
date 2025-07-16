import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardBedAreaMaintenanceComponent } from './ward-bed-area-maintenance.component';

describe('WardBedAreaMaintenanceComponent', () => {
  let component: WardBedAreaMaintenanceComponent;
  let fixture: ComponentFixture<WardBedAreaMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardBedAreaMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardBedAreaMaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
