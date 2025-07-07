import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from 'projects/shared-ui/src/lib/components/form-components/custom-input/custom-input.component';

@Component({
  selector: 'tenant-beds',
  imports: [CustomInputComponent, ReactiveFormsModule],
  templateUrl: './beds.component.html',
  styleUrl: './beds.component.css',
})
export class BedsComponent implements OnInit {
  userForm!: FormGroup;
  constructor(private fb: NonNullableFormBuilder) {}
  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(5)]],
    });
  }
}
