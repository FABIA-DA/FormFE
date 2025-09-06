import {Component, computed, inject, Signal} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {FieldTypeService} from '../../../core/service/field-type-service';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {MatError, MatFormField} from '@angular/material/form-field';
import {MatInput, MatLabel} from '@angular/material/input';
import {MatButton} from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-add-field-type',
  imports: [MatCardModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, MatButton],
  templateUrl: './add-field-type.html',
  styleUrl: './add-field-type.scss'
})
export class AddFieldType {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly fieldTypeForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    regex: ['', Validators.required]
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
      this.valueChanged();
      return this.fieldTypeForm.valid;
  });
  private readonly valueChanged: Signal<any> = toSignal(this.fieldTypeForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);

  protected async onSubmit(): Promise<void> {
    if(!this.isValid()){
      this.snackbar.show('The form is still invalid...');
      return;
    }

    const name: string | null = this.fieldTypeForm.get('name')?.value;
    let description: string | null = this.fieldTypeForm.get('description')?.value;
    const regex: string | null = this.fieldTypeForm.get('regex')?.value;

    description = description?.length === 0 ? null : description;

    if(!name
    || !regex){
      this.snackbar.show('Some fields are still invalid...');
      return;
    }

    await this.fieldTypeService.createFieldTypeAsync(name, description, regex);
    this.snackbar.show('Field type was submitted successfully.');
    this.fieldTypeForm.reset();
    return;
  }
}
