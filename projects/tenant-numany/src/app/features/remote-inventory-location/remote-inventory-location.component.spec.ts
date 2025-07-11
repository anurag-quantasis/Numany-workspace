import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteInventoryLocationComponent } from './remote-inventory-location.component';

describe('RemoteInventoryLocationComponent', () => {
  let component: RemoteInventoryLocationComponent;
  let fixture: ComponentFixture<RemoteInventoryLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteInventoryLocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoteInventoryLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
