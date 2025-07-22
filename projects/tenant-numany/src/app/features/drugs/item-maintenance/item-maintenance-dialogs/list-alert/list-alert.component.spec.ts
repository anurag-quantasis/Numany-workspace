import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAlertComponent } from './list-alert.component';

describe('ListAlertComponent', () => {
  let component: ListAlertComponent;
  let fixture: ComponentFixture<ListAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
