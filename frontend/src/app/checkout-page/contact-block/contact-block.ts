import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { VALIDATION_PATTERNS } from '../../core/validation.constants';

@Component({
  selector: 'app-contact-block',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule, MatSlideToggleModule, MatFormFieldModule, MatInputModule],
  templateUrl: './contact-block.html',
  styleUrls: ['./contact-block.scss']
})
export class ContactBlockComponent implements OnInit {
  @Input() userName = '';
  @Input() userPhone = '';
  @Input() isReadOnly = false;

  @Output() profileChanged = new EventEmitter<{ name: string; phone: string }>();
  @Output() formDataChanged = new EventEmitter<{ comment: string; noPaperReceipt: boolean }>();

  contactForm!: FormGroup;
  isEditing = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: [this.userName, [
        Validators.required, 
        Validators.minLength(2),
        Validators.pattern(VALIDATION_PATTERNS.NAME)
      ]],
      phone: [this.userPhone, [
        Validators.required,
        Validators.pattern(VALIDATION_PATTERNS.PHONE_UA)
      ]],
      comment: ['', [Validators.maxLength(500)]],
      noPaperReceipt: [false]
    });

    this.contactForm.valueChanges.subscribe(value => {
      this.formDataChanged.emit({
        comment: value.comment,
        noPaperReceipt: value.noPaperReceipt
      });

      if (this.contactForm.get('name')?.valid && this.contactForm.get('phone')?.valid) {
        this.profileChanged.emit({ name: value.name, phone: value.phone });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.contactForm && (changes['userName'] || changes['userPhone'])) {
      this.contactForm.patchValue({
        name: this.userName,
        phone: this.userPhone
      }, { emitEvent: false }); 
    }
  }
  
  get commentLength(): number {
    return this.contactForm.get('comment')?.value?.length || 0;
  }
}