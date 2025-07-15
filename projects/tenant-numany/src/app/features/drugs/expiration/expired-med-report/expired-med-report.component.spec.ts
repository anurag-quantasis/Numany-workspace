import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredMedReportComponent } from './expired-med-report.component';

describe('ExpiredMedReportComponent', () => {
  let component: ExpiredMedReportComponent;
  let fixture: ComponentFixture<ExpiredMedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredMedReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpiredMedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
