import { CommonModule } from '@angular/common';
import { Component, inject, OnInit,DestroyRef, OnDestroy  } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomInputComponent } from 'shared-ui';
import { TextareaModule } from 'primeng/textarea';
import { Button } from "primeng/button";
import { SelectModule } from 'primeng/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TenantAlertMessageService } from './tenant-alert-message.service';
import { take } from 'rxjs';
import { MessageService } from 'primeng/api';

interface AlertMessage {
  msg_id: number;
  msg_name: string;
  msg_txt: string;
}

@Component({
  selector: 'tenant-alert-message',
  imports: [CustomInputComponent, ReactiveFormsModule, CommonModule, TextareaModule, Button, SelectModule],
  templateUrl: './tenant-alert-message.component.html',
  styleUrl: './tenant-alert-message.component.css',
  providers: [TenantAlertMessageService]
})
export class TenantAlertMessageComponent implements OnInit, OnDestroy{
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);
  private readonly tenantAlertMessageService = inject(TenantAlertMessageService);
  // isAddingNew = false;
  mode: 'select' | 'add' | 'edit' = 'select';

  existingMessages = [
    { id: 1, msg_name: 'No Scr', msg_txt: 'No Serum creatinine found' },
    { id: 2, msg_name: 'Patient Deceased', msg_txt: 'The patient is marked as deceased in the system.' },
    { id: 3, msg_name: 'High Risk', msg_txt: 'Patient is flagged as high risk for complications.' },
  ];

  messageAlertForm = this.fb.group({
    selectedMsg: [null as AlertMessage | null], // Typed for clarity
    msg_name: ['', [Validators.required]],
    msg_txt: ['', [Validators.required]],
  });

  // GETTERS
  // Getter for easy access to the form control
  get msg_txt(): AbstractControl | null {
    return this.messageAlertForm.get('msg_txt');
  }

  // *** THIS IS THE KEY GETTER FOR YOUR TEMPLATE ***
  // It returns true only when the control is invalid AND has been touched or modified.
  get isMsgTxtInvalid(): boolean {
    return !!(this.msg_txt?.invalid && (this.msg_txt?.dirty || this.msg_txt?.touched));
  }

  ngOnInit(): void {
    this.loadMessages();
    this.setMode('select'); // Set initial state
    this.setupSelectionChanges();
  }

  loadMessages(): void {
    this.tenantAlertMessageService.getTenantAlertMessages()
      .pipe(take(1)) // Automatically unsubscribes after the first emission
      .subscribe({
        next: (response) => {
          this.existingMessages = response.data;
        },
        error: (err) => console.error('Failed to load messages:', err)
      });
  }

  setMode(newMode: 'select' | 'add' | 'edit'): void {
    this.mode = newMode;

    const msgNameControl = this.messageAlertForm.get('msg_name');
    const msgTxtControl = this.messageAlertForm.get('msg_txt');
    const selectedMsgControl = this.messageAlertForm.get('selectedMsg');

    if (this.mode === 'select') {
      this.messageAlertForm.reset();
      selectedMsgControl?.enable();
      msgNameControl?.disable();
      msgTxtControl?.disable();
    } else if (this.mode === 'add') {
      this.messageAlertForm.reset();
      selectedMsgControl?.disable();
      msgNameControl?.enable();
      msgTxtControl?.enable();
    } else if (this.mode === 'edit') {
      // Pre-populate form with selected message data for editing
      const currentMsg = selectedMsgControl?.value;
      if (currentMsg) {
        this.messageAlertForm.patchValue({
          msg_name: currentMsg.msg_name,
          msg_txt: currentMsg.msg_txt,
        });
      }
      selectedMsgControl?.disable();
      msgNameControl?.enable();
      msgTxtControl?.enable();
    }
  }

  // Automatically update form when dropdown selection changes
  private setupSelectionChanges(): void {
    this.messageAlertForm.get('selectedMsg')?.valueChanges
      // 2. Pass the destroyRef to the operator
      .pipe(takeUntilDestroyed(this.destroyRef)) 
      .subscribe(selected => {
        if (selected) {
          // In select mode, we only want to patch the text, not the name
          this.messageAlertForm.patchValue({ msg_txt: selected.msg_txt });
        } else {
          // Clear the text if nothing is selected
          this.messageAlertForm.get('msg_txt')?.reset('');
        }
      });
  }

  onAdd(): void {
    this.setMode('add');
  }

  onEdit(): void {
    if (this.messageAlertForm.get('selectedMsg')?.value) {
      this.setMode('edit');
    } else {
      // Optionally, show a toast/notification to select a message first
      console.warn('Please select a message to edit.');
    }
  }

  onDelete(): void {
    const selected = this.messageAlertForm.get('selectedMsg')?.value;
    if (!selected) return;
    
    this.tenantAlertMessageService.deleteTenantAlertMessage(selected.msg_id)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            key: 'custom-toast',
            severity: 'error',
            summary: 'Deleted',
            detail: response.message,
            styleClass: 'border-none bg-white'
          });
          // Refresh the list from the server to ensure consistency
          this.loadMessages();
          this.setMode('select');
        },
        error: (err) => console.error('Failed to delete message:', err)
      });
  }
  
  onCancel(): void {
    this.setMode('select');
  }

  onSubmit(): void {
    if (this.messageAlertForm.invalid) {
      this.messageAlertForm.markAllAsTouched();
      return;
    }

    if (this.mode === 'add') {
      const payload = {
        msg_name: this.messageAlertForm.get('msg_name')?.value!,
        msg_txt: this.messageAlertForm.get('msg_txt')?.value!
      };
      // ---- API call to create would go here: this.apiService.createMessage(payload).subscribe(...) ----
      // Mock creation
      const newId = Math.max(...this.existingMessages.map(m => m.id)) + 1;
      this.existingMessages.push({ id: newId, ...payload });

    } else if (this.mode === 'edit') {
      const selectedId = this.messageAlertForm.get('selectedMsg')?.value?.msg_id;
      const payload = {
        msg_id: selectedId,
        msg_name: this.messageAlertForm.get('msg_name')?.value!,
        msg_txt: this.messageAlertForm.get('msg_txt')?.value!
      };
      console.log("api",payload)
      if (selectedId) {
        console.log("api",selectedId)
        this.tenantAlertMessageService.updateTenantAlertMessage(selectedId, payload)
          .pipe(take(1))
          .subscribe({
            next: (response) => {
              this.loadMessages();
              this.messageService.add({
                key: 'custom-toast',
                severity: 'success',
                summary: 'Success',
                detail: response.message,
                styleClass: 'border-none bg-white'
              });
              this.setMode('select');
            },
            error: (err) => {
              console.error('Failed to update message:', err);
              this.messageService.add({
                key: 'custom-toast',
                severity: 'warning',
                summary: err.message || 'Something went wrong',
                styleClass: 'border-none bg-white'
              });
            }
          });
      }
    }

    this.setMode('select'); // Return to select mode after submission
  }

  ngOnDestroy(): void {
    if (this.messageAlertForm) {
      this.messageAlertForm.reset();
    }
  }
}
