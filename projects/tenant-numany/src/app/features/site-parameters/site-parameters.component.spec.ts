import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteParametersComponent } from './site-parameters.component';

describe('SiteParametersComponent', () => {
  let component: SiteParametersComponent;
  let fixture: ComponentFixture<SiteParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
