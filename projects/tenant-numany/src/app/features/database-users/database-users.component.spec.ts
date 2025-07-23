import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseUsersComponent } from './database-users.component';

describe('DatabaseUsersComponent', () => {
  let component: DatabaseUsersComponent;
  let fixture: ComponentFixture<DatabaseUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatabaseUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatabaseUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
