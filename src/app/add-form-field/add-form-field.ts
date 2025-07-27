import {Component, computed, inject, Signal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {FormField} from '../../../core/module';

@Component({
  selector: 'app-add-form-field',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInputModule,
    MatError,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatCardActions,
    MatButton,
  ],
  templateUrl: './add-form-field.html',
  styleUrl: './add-form-field.scss'
})
export class AddFormField {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly fieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    isOptional: [false, Validators.required],
    type: ['', Validators.required]
  });
  private readonly valueChanged: Signal<any> = toSignal(this.fieldForm.valueChanges);
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.valueChanged();
    return this.fieldForm.valid;
  });
  private readonly snackbar: SnackbarService = inject(SnackbarService);

  protected async onSubmit(): Promise<void>
  {
    if(!this.isValid()){
      this.snackbar.show('The form is still invalid...');
      return;
    }

    const name: string | null = this.fieldForm.get('name')?.value;
    const description: string | null = this.fieldForm.get('description')?.value;
    const isOptional: boolean | null = this.fieldForm.get('isOptional')?.value;
    const type: string | null = this.fieldForm.get('type')?.value;

    if (!name
    || !description
    || !isOptional
    || !type){
      this.snackbar.show('Some form fields are still invalid...');
      return;
    }

    const formField: FormField = {
      id: 0,
      name: name,
      description: description,
      isOptional: isOptional,
      type: type
    };

    //TODO send request

    this.snackbar.show('Form field was submitted successfully.');
    this.fieldForm.reset();
    return;
  }
}
