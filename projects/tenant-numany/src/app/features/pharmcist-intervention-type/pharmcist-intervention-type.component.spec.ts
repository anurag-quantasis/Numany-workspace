import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmcistInterventionTypeComponent } from './pharmcist-intervention-type.component';

describe('PharmcistInterventionTypeComponent', () => {
  let component: PharmcistInterventionTypeComponent;
  let fixture: ComponentFixture<PharmcistInterventionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PharmcistInterventionTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PharmcistInterventionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
