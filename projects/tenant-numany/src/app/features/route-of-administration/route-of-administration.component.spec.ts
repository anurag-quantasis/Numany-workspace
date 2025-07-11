import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteOfAdministrationComponent } from './route-of-administration.component';

describe('RouteOfAdministrationComponent', () => {
  let component: RouteOfAdministrationComponent;
  let fixture: ComponentFixture<RouteOfAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteOfAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteOfAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
