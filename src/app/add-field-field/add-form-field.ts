import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {DataFormField} from '../../../core/module';
import {FormService} from '../../../core/service/form-service';

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
export class AddFormField implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly fieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    isOptional: [false, Validators.required],
    type: ['', Validators.required]
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.valueChanged();
    return this.fieldForm.valid;
  });
  protected readonly fieldTypes: WritableSignal<string[]> = signal([]);
  private readonly valueChanged: Signal<any> = toSignal(this.fieldForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly service: FormService = inject(FormService);

  public async ngOnInit(): Promise<void> {
    this.fieldTypes.set(await this.service.getDataFieldTypes());
  }

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

    const formField: DataFormField = {
      id: 0,
      name: name,
      description: description,
      isOptional: isOptional,
      type: type
    };

    await this.service.sendDataField(formField);

    this.snackbar.show('Form field was submitted successfully.');
    this.fieldForm.reset();
    return;
  }
}
