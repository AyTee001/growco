import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormField, MatLabel } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-contact-block',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatSlideToggleModule, MatFormField, MatLabel, MatInputModule],
  templateUrl: './contact-block.html',
  styleUrls: ['./contact-block.scss']
})
export class ContactBlockComponent implements OnInit {
  @Input() userName = '';
  @Input() userPhone = '';
  @Output() profileChanged = new EventEmitter<{ name: string; phone: string }>();
  @Output() formDataChanged = new EventEmitter<{ comment: string; noPaperReceipt: boolean }>();

  contactForm!: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      comment: ['', [Validators.maxLength(500)]],
      noPaperReceipt: [false]
    });

    this.contactForm.valueChanges.subscribe(() => {
      this.formDataChanged.emit(this.contactForm.value);
    });
  }

  get commentLength(): number {
    return this.contactForm.get('comment')?.value?.length || 0;
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  saveUserData(name: string, phone: string): void {
    if (name.trim()) this.userName = name;
    if (phone.trim()) this.userPhone = phone;
    this.isEditing = false;
    this.profileChanged.emit({ name: this.userName, phone: this.userPhone });
  }

  cancelEditing(): void {
    this.isEditing = false;
  }
}