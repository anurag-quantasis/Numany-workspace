import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedStateSelectorComponent } from './shared-state-selector.component';

describe('SharedStateSelectorComponent', () => {
  let component: SharedStateSelectorComponent;
  let fixture: ComponentFixture<SharedStateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedStateSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedStateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
