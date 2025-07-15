import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmcistInterventionTypeMaintainanceComponent } from './pharmacist-intervention-type-maintenance';

describe('PharmcistInterventionTypeComponent', () => {
  let component: PharmcistInterventionTypeMaintainanceComponent;
  let fixture: ComponentFixture<PharmcistInterventionTypeMaintainanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmcistInterventionTypeMaintainanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmcistInterventionTypeMaintainanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
