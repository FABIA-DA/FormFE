import { Component, inject } from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatDivider} from '@angular/material/divider';
import {FormField} from '../../../core/module';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-add-one-of-form-field',
  imports: [
    MatCardTitle,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatDivider,
    MatButton,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './add-one-of-form-field.html',
  styleUrl: './add-one-of-form-field.scss'
})
export class AddOneOfFormField {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly oneOfFieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    options: this.formBuilder.array([
      this.formBuilder.control<string>('', [Validators.required]),
      this.formBuilder.control<string>('', [Validators.required])
    ]),
    fields: this.formBuilder.array([
      this.formBuilder.control<FormField[]>([]),
      this.formBuilder.control<FormField[]>([]),
    ])
  });

  get options(): FormArray {
    return this.oneOfFieldForm.get('options') as FormArray;
  }

  get fields(): FormArray {
    return this.oneOfFieldForm.get('fields') as FormArray;
  }

  addOptions(): void {
    this.options.push(this.formBuilder.control('', [Validators.required]));
  }

  addFields(): void {
    this.formBuilder.control([]);
  }

  deleteOption(id: number): void {
    this.options.removeAt(id);
  }

  deleteField(id: number): void {
    this.fields.removeAt(id);
  }

  protected async addFormField(id: number): Promise<void> {
    //TODO
  }
}
