import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-receiver-input',
  imports: [],
  templateUrl: './receiver-input.html',
  styleUrl: './receiver-input.scss'
})
export class ReceiverInput {
  protected readonly receiverForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    streetName: new FormControl('', Validators.required),
    streetNumber: new FormControl(undefined, Validators.required),
    city: new FormControl(undefined, Validators.required)
  });
}
