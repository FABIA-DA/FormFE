import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact-details-input',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact-details-input.html',
  styleUrl: './contact-details-input.scss'
})
export class ContactDetailsInput {
  protected readonly contactDetailsForm: FormGroup = new FormGroup({
    telephoneNumber: new FormControl(undefined, Validators.required),
    email: new FormControl(undefined, Validators.required),
  });
}
