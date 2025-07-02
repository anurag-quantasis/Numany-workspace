import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext'
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ShortcutDirective } from '../../core/directive/shortcut.directive';
import { ShortcutKeyHintDirective } from '../../core/directive/shortcut-key-hint.directive';

@Component({
  selector: 'main-departments',
  imports: [SelectModule, InputTextModule, ReactiveFormsModule, ButtonModule, ShortcutDirective,
      ShortcutKeyHintDirective,],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit {
  departmentForm!: FormGroup;
 departmentOptions = [
  {id: 1, name: '1ST DEPT', value: '1st dept'},
  {id: 2, name: 'IBS, INC', value: 'ibs, inc'},
  {id: 3, name: 'Mid Wives',value: 'mid wives'},
  {id: 4, name: 'NEW DEPARTMENT', value: 'new department'},
  {id: 5, name: 'WASTED MEDS', value: 'wasted meds'},
];

constructor (private fb:NonNullableFormBuilder){}

ngOnInit():void {
  this.departmentForm = this.fb.group({
    department: ['', Validators.required],
    id: ['', Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    phone: ['', Validators.required],
    note: ['', Validators.required],
    cost_basis: ['', Validators.required],
    markup: ['', Validators.required],
    tax_flag: ['', Validators.required]
  });

   this.departmentForm.get('department')!.valueChanges.subscribe(selectedId => {
    const selectedDept = this.departmentOptions.find(dept => dept.id === selectedId);
    if (selectedDept) {
      this.departmentForm.patchValue({
        id: selectedDept.id,
        name: selectedDept.name
      });
    } else {
      this.departmentForm.patchValue({ id: '', name: '' });
    }
  });
}

printForm():void{
  console.log(this.departmentForm.value)
}

resetForm():void {
  this.departmentForm.reset();
}
}
