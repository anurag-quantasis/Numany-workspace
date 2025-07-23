import { Component, inject, OnInit } from '@angular/core';
import { SharedPanelContainerComponent, SharedDataTableComponent, ColumnDef, CustomInputComponent } from 'shared-ui';
import { Button } from "primeng/button";
import { MessageService } from 'primeng/api';
import { TenantStore } from './tenant-store/tenant.store';
import { NewTenant, Tenant } from './tenant-store/tenant.model';
import { TenantPageService } from './service/tenant.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
// import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'main-tenant',
  imports: [SharedPanelContainerComponent, SharedDataTableComponent, Button, DialogModule, CustomInputComponent, ReactiveFormsModule, DatePicker],
  templateUrl: './tenant.component.html',
  styleUrl: './tenant.component.css',
  providers: [TenantStore]
})
export class TenantComponent {
  private readonly messageService = inject(MessageService);
  readonly store = inject(TenantStore);
  private readonly fb = inject(FormBuilder).nonNullable;
  isAddDialogVisible = false;
  isSubmitted: boolean = false;


  tenantForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    // Initialize with an empty string instead of null
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    address: ['', [Validators.required]],
    expiryDate: [new Date(), [Validators.required]]
  });

   readonly columns: ColumnDef<Tenant>[] = [
     { field: 'id', header: 'Id' }, // Add date filtering if needed
    { field: 'name', header: 'Name',  },
    { field: 'description', header: 'Description',  },
    { field: 'description', header: 'Description',  },
  ];

  showTenatForm(){
    this.tenantForm.reset();
    this.isAddDialogVisible = true;
  }

  saveNewTenant(){
    this.isSubmitted = true;
    if(this.tenantForm.valid){
      console.log("Form Valid", this.tenantForm.value);
      const tenantPayload = this.tenantForm.getRawValue() as NewTenant;
    this.store.addTenant(tenantPayload);
    } else {
      this.tenantForm.markAllAsTouched()
      console.log("Form Invalid", this.tenantForm.invalid);
    }
  }

  handleSelectionChange(bed:any): void {
    // The event now emits a single object, not an array.
    console.log('BED', bed)
  }
}
