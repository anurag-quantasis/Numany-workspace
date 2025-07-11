import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSupplierComponent } from './vendor-supplier.component';

describe('VendorSupplierComponent', () => {
  let component: VendorSupplierComponent;
  let fixture: ComponentFixture<VendorSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSupplierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
