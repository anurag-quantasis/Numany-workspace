import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationSchedulesComponent } from './administration-schedules.component';

describe('AdministrationSchedulesComponent', () => {
  let component: AdministrationSchedulesComponent;
  let fixture: ComponentFixture<AdministrationSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrationSchedulesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
