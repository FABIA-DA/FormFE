import {Component, computed, inject, OnInit, signal, Signal, WritableSignal} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardTitle} from '@angular/material/card';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatButton, MatFabButton} from '@angular/material/button';
import {toSignal} from '@angular/core/rxjs-interop';
import {SnackbarService} from '../../../../core/service/snackbar-service';
import {Field, FieldService} from '../../../../core/service/field-service';
import {FieldType, FieldTypeService} from '../../../../core/service/field-type-service';
import {ItemSelectionList} from '../../../../core/shared/item-selection-list/item-selection-list.component';
import {MatDivider} from '@angular/material/divider';
import {MatProgressBar} from '@angular/material/progress-bar';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Subscription} from 'rxjs';
import {IdType} from '../../../../core/service/base-service';
import {MatIcon} from '@angular/material/icon';

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
    RouterLink,
    MatIcon,
    MatFabButton,
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
  protected readonly fieldTypeRequired: boolean = true;
  protected readonly fieldTypeDirty: WritableSignal<boolean> = signal(false);
  protected readonly processing: WritableSignal<boolean> = signal(false);
  protected readonly field: WritableSignal<Field | undefined> = signal(undefined);
  protected readonly isUpdate: Signal<boolean> = computed(() => {
    return this.field() !== undefined;
  });
  private readonly valueChanged: Signal<any> = toSignal(this.fieldForm.valueChanges);
  private readonly snackbar: SnackbarService = inject(SnackbarService);
  private readonly fieldService: FieldService = inject(FieldService);
  private readonly fieldTypeService: FieldTypeService = inject(FieldTypeService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly subscriptions: Subscription[] = [];

  public async ngOnInit(): Promise<void> {
    this.subscriptions.push(this.activatedRoute.params.subscribe(async params => {
      const id: IdType | undefined = params['id'];
      if(id === undefined){
        this.field.set(undefined);
        return;
      }
      this.processing.set(true);
      try{
        this.field.set(await this.fieldService.getFieldByIdAsync(id));
        this.setFormValues();
      }
      finally{
        this.processing.set(false);
      }
    }));
    this.fieldTypes.set(await this.fieldTypeService.getAllFieldTypesAsync());
  }

  public ngOnDestroy(): void {
    for(const subscription of this.subscriptions){
      subscription.unsubscribe();
    }
  }

  private setFormValues(): void {
    this.fieldForm.get('name')?.setValue(this.field()?.name);
    this.fieldForm.get('description')?.setValue(this.field()?.description);
    this.fieldForm.get('isOptional')?.setValue(this.field()?.isOptional);
    this.selectedFieldType.set(this.field()?.type);
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
      if(!this.isUpdate()){
        await this.fieldService.createFieldAsync(type.id, name, description, isOptional);
        this.reset();
      }
      else {
        await this.fieldService.updateFieldAsync(this.field()!.id, type.id, name, description, isOptional);
      }
      this.snackbar.show('Form field was submitted successfully.');
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
