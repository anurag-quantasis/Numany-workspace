import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionDataClassesComponent } from './intervention-data-classes.component';

describe('InterventionDataClassesComponent', () => {
  let component: InterventionDataClassesComponent;
  let fixture: ComponentFixture<InterventionDataClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionDataClassesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionDataClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
