import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormularyItemsComponent } from './select-formulary-items.component';

describe('SelectFormularyItemsComponent', () => {
  let component: SelectFormularyItemsComponent;
  let fixture: ComponentFixture<SelectFormularyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFormularyItemsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectFormularyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
