import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantClinicalScreeningComponent } from './tenant-clinical-screening.component';

describe('TenantClinicalScreeningComponent', () => {
  let component: TenantClinicalScreeningComponent;
  let fixture: ComponentFixture<TenantClinicalScreeningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantClinicalScreeningComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantClinicalScreeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
