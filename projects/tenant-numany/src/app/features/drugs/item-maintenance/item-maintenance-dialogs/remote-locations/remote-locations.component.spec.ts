import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteLocationsComponent } from './remote-locations.component';

describe('RemoteLocationsComponent', () => {
  let component: RemoteLocationsComponent;
  let fixture: ComponentFixture<RemoteLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteLocationsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoteLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
