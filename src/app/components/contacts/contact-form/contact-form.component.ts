import { Component, inject, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-contact-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private contactsService = inject(ContactsService);
  private snackBar = inject(MatSnackBar);

  contactForm!: FormGroup;
  isEditMode = signal(false);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      mobile: [true],
      company: [''],
      notes: ['']
    });
  }

  private checkEditMode(): void {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.isEditMode.set(true);
      this.loadContact(contactId);
    }
  }

  private loadContact(id: string): void {
    const contact = this.contactsService.getContactById(id);
    if (contact) {
      this.contactForm.patchValue({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        mobile: contact.mobile,
        company: contact.company || '',
        notes: contact.notes || ''
      });
    } else {
      this.snackBar.open('Contact not found', 'Close', { duration: 3000 });
      this.router.navigate(['/contacts']);
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting.set(true);
      
      const formValue = this.contactForm.value;
      
      if (this.isEditMode()) {
        const contactId = this.route.snapshot.paramMap.get('id')!;
        this.contactsService.updateContact(contactId, formValue);
        this.snackBar.open('Contact updated successfully', 'Close', { duration: 3000 });
      } else {
        this.contactsService.addContact(formValue);
        this.snackBar.open('Contact added successfully', 'Close', { duration: 3000 });
      }
      
      this.isSubmitting.set(false);
      this.router.navigate(['/contacts']);
    }
  }
} 