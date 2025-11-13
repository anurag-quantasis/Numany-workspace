import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantProviderNumbersComponent } from './tenant-provider-numbers.component';

describe('TenantProviderNumbersComponent', () => {
  let component: TenantProviderNumbersComponent;
  let fixture: ComponentFixture<TenantProviderNumbersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantProviderNumbersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantProviderNumbersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
