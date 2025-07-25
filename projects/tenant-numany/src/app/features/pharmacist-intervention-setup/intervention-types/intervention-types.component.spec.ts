import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionTypesComponent } from './intervention-types.component';

describe('InterventionTypesComponent', () => {
  let component: InterventionTypesComponent;
  let fixture: ComponentFixture<InterventionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionTypesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InterventionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
