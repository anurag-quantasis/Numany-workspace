import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandedButtonComponent } from './branded-button.component';

describe('BrandedButtonComponent', () => {
  let component: BrandedButtonComponent;
  let fixture: ComponentFixture<BrandedButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandedButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrandedButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
