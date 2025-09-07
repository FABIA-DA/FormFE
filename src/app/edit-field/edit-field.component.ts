import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../core/service/snackbar-service';
import {FieldService} from '../../../core/service/field-service';
import {FieldType, FieldTypeService} from '../../../core/service/field-type-service';
import {ItemSelectionList} from '../../../core/shared/item-selection-list/item-selection-list.component';
import {MatDivider} from '@angular/material/divider';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-edit-field',
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
    MatCardActions,
    MatButton,
    ItemSelectionList,
    MatDivider,
    MatProgressBar,
  ],
  templateUrl: './edit-field.component.html',
  styleUrl: './edit-field.component.scss',
  standalone: true
})
export class EditField implements OnInit {
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  protected readonly fieldForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    isOptional: [false, Validators.required]
  });
  protected readonly isValid: Signal<boolean> = computed(() => {
    this.valueChanged();
    return this.fieldForm.valid && this.selectedFieldType() !== undefined;
  });
  protected readonly fieldTypes: WritableSignal<FieldType[]> = signal([]);
  protected readonly selectedFieldType: WritableSignal<FieldType | undefined> = signal(undefined);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  private readonly valueChanged: Signal<any> = toSignal(this.fieldForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly fieldService: FieldService = inject(FieldService);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);

  public async ngOnInit(): Promise<void> {
    this.fieldTypes.set(await this.fieldTypeService.getAllFieldTypesAsync());
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
    const type: FieldType | undefined = this.selectedFieldType();

    if (!name
    || !description
    || isOptional === null
    || !type){
      this.snackbar.show('Some form fields are still invalid...');
      return;
    }

    this.processing.set(true);
    try{
      await this.fieldService.createFieldAsync(type.id, name, description, isOptional);
      this.snackbar.show('Form field was submitted successfully.');
      this.reset();
    }
    finally{
      this.processing.set(false);
    }
  }

  private reset(){
    this.selectedFieldType.set(undefined);
    this.fieldForm.reset();
  }
}
