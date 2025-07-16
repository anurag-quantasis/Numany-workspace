import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleSelectorComponent } from './schedule-selector.component';

describe('ScheduleSelectorComponent', () => {
  let component: ScheduleSelectorComponent;
  let fixture: ComponentFixture<ScheduleSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
