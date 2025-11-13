import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDateComponent } from './modify-date.component';

describe('ModifyDateComponent', () => {
  let component: ModifyDateComponent;
  let fixture: ComponentFixture<ModifyDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyDateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModifyDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
