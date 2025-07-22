import {Component} from '@angular/core';
import {MatCard, MatCardTitle} from '@angular/material/card';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-add',
  imports: [
    MatCard,
    MatCardTitle,
    ReactiveFormsModule
  ],
  templateUrl: './add.html',
  styleUrl: './add.scss'
})
export class Add {
  protected readonly formGroup: FormGroup = new FormGroup({
    formName: new FormControl('', Validators.required),
    formInfo: new FormControl(''),
    formRequirements: new FormControl('', Validators.required),
    usedDocuments: new FormControl('', Validators.required)

  });
}
